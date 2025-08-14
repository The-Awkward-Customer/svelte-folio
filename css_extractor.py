#!/usr/bin/env python3
"""
CSS Extractor for Svelte Components
Extracts all CSS properties and values from Svelte component files and creates
a structured mapping suitable for CSV conversion.
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, List, Set, Any, Optional

class SvelteCSSExtractor:
    def __init__(self, base_path: str):
        self.base_path = Path(base_path)
        self.components_data = {}
        self.all_css_properties = set()
        
    def extract_style_section(self, file_content: str) -> Optional[str]:
        """Extract the content between <style> tags"""
        # Look for <style> sections, handle both self-closing and regular tags
        style_pattern = r'<style[^>]*>(.*?)</style>'
        match = re.search(style_pattern, file_content, re.DOTALL)
        if match:
            return match.group(1).strip()
        return None
    
    def parse_css_rules(self, css_content: str) -> Dict[str, Dict[str, str]]:
        """Parse CSS content and extract rules"""
        rules = {}
        
        # Remove CSS comments
        css_content = re.sub(r'/\*.*?\*/', '', css_content, flags=re.DOTALL)
        
        # Find CSS rules (selector { properties })
        rule_pattern = r'([^{}]+)\s*{\s*([^{}]*)\s*}'
        
        for match in re.finditer(rule_pattern, css_content):
            selector = match.group(1).strip()
            properties_block = match.group(2).strip()
            
            # Parse individual properties
            properties = {}
            prop_pattern = r'([^:;]+)\s*:\s*([^:;]+)(?:;|$)'
            
            for prop_match in re.finditer(prop_pattern, properties_block):
                property_name = prop_match.group(1).strip()
                property_value = prop_match.group(2).strip()
                
                if property_name and property_value:
                    properties[property_name] = property_value
                    self.all_css_properties.add(property_name)
            
            if properties:
                rules[selector] = properties
                
        return rules
    
    def extract_component_css(self, file_path: Path) -> Dict[str, Any]:
        """Extract CSS data from a single component file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            style_content = self.extract_style_section(content)
            if not style_content:
                return {
                    'file_path': str(file_path),
                    'relative_path': str(file_path.relative_to(self.base_path)),
                    'component_name': file_path.stem,
                    'has_styles': False,
                    'css_rules': {}
                }
            
            css_rules = self.parse_css_rules(style_content)
            
            return {
                'file_path': str(file_path),
                'relative_path': str(file_path.relative_to(self.base_path)),
                'component_name': file_path.stem,
                'has_styles': True,
                'css_rules': css_rules,
                'raw_css': style_content
            }
            
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            return {
                'file_path': str(file_path),
                'relative_path': str(file_path.relative_to(self.base_path)),
                'component_name': file_path.stem,
                'has_styles': False,
                'css_rules': {},
                'error': str(e)
            }
    
    def process_all_components(self) -> None:
        """Process all Svelte components in the base path"""
        svelte_files = list(self.base_path.rglob("*.svelte"))
        print(f"Found {len(svelte_files)} Svelte files")
        
        for file_path in svelte_files:
            component_data = self.extract_component_css(file_path)
            self.components_data[component_data['component_name']] = component_data
            
    def create_property_matrix(self) -> Dict[str, Dict[str, str]]:
        """Create a matrix where rows are CSS properties and columns are components"""
        matrix = {}
        
        # Initialize matrix with all properties
        for prop in sorted(self.all_css_properties):
            matrix[prop] = {}
            
        # Fill in the matrix
        for comp_name, comp_data in self.components_data.items():
            if not comp_data.get('has_styles', False):
                continue
                
            # Collect all property values for this component across all selectors
            component_properties = {}
            
            for selector, properties in comp_data.get('css_rules', {}).items():
                for prop_name, prop_value in properties.items():
                    if prop_name in component_properties:
                        # If property appears multiple times, create a list
                        if isinstance(component_properties[prop_name], list):
                            component_properties[prop_name].append(f"{selector}: {prop_value}")
                        else:
                            component_properties[prop_name] = [
                                component_properties[prop_name],
                                f"{selector}: {prop_value}"
                            ]
                    else:
                        component_properties[prop_name] = f"{selector}: {prop_value}"
            
            # Add to matrix
            for prop in matrix:
                if prop in component_properties:
                    value = component_properties[prop]
                    if isinstance(value, list):
                        matrix[prop][comp_name] = " | ".join(value)
                    else:
                        matrix[prop][comp_name] = value
                else:
                    matrix[prop][comp_name] = ""
                    
        return matrix
    
    def create_component_matrix(self) -> Dict[str, Dict[str, str]]:
        """Create a matrix where rows are components and columns are CSS properties"""
        matrix = {}
        
        for comp_name, comp_data in self.components_data.items():
            if not comp_data.get('has_styles', False):
                matrix[comp_name] = {}
                continue
                
            component_row = {}
            
            # Collect all property values for this component across all selectors
            for selector, properties in comp_data.get('css_rules', {}).items():
                for prop_name, prop_value in properties.items():
                    if prop_name in component_row:
                        # If property appears multiple times, append
                        component_row[prop_name] += f" | {selector}: {prop_value}"
                    else:
                        component_row[prop_name] = f"{selector}: {prop_value}"
            
            # Fill in missing properties with empty strings
            for prop in sorted(self.all_css_properties):
                if prop not in component_row:
                    component_row[prop] = ""
                    
            matrix[comp_name] = component_row
                    
        return matrix
    
    def generate_csv_data(self) -> Dict[str, Any]:
        """Generate data suitable for CSV conversion"""
        property_matrix = self.create_property_matrix()
        component_matrix = self.create_component_matrix()
        
        # Create CSV-friendly format
        csv_data = {
            'property_rows': {
                'headers': ['CSS Property'] + list(self.components_data.keys()),
                'data': []
            },
            'component_rows': {
                'headers': ['Component'] + sorted(self.all_css_properties),
                'data': []
            }
        }
        
        # Property-centric view (properties as rows)
        for prop in sorted(self.all_css_properties):
            row = [prop]
            for comp_name in self.components_data.keys():
                value = property_matrix.get(prop, {}).get(comp_name, "")
                row.append(value)
            csv_data['property_rows']['data'].append(row)
            
        # Component-centric view (components as rows)
        for comp_name in sorted(self.components_data.keys()):
            if not self.components_data[comp_name].get('has_styles', False):
                continue
            row = [comp_name]
            for prop in sorted(self.all_css_properties):
                value = component_matrix.get(comp_name, {}).get(prop, "")
                row.append(value)
            csv_data['component_rows']['data'].append(row)
        
        return csv_data
    
    def save_results(self, output_path: str) -> None:
        """Save extraction results to JSON file"""
        results = {
            'metadata': {
                'total_components': len(self.components_data),
                'components_with_styles': len([c for c in self.components_data.values() if c.get('has_styles', False)]),
                'total_css_properties': len(self.all_css_properties),
                'css_properties': sorted(list(self.all_css_properties))
            },
            'components': self.components_data,
            'csv_data': self.generate_csv_data()
        }
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        print(f"Results saved to {output_path}")
        print(f"Total components: {results['metadata']['total_components']}")
        print(f"Components with styles: {results['metadata']['components_with_styles']}")
        print(f"Total CSS properties found: {results['metadata']['total_css_properties']}")

def main():
    # Path to the components directory
    components_path = "/Users/peterabbott/folio/svelte-folio/frontend/src/lib/components"
    output_path = "/Users/peterabbott/folio/svelte-folio/css_extraction_results.json"
    
    extractor = SvelteCSSExtractor(components_path)
    print(f"Starting CSS extraction from: {components_path}")
    
    extractor.process_all_components()
    extractor.save_results(output_path)
    
    # Print summary of most common properties
    if extractor.all_css_properties:
        print(f"\nMost common CSS properties found:")
        property_usage = {}
        for comp_data in extractor.components_data.values():
            if comp_data.get('has_styles', False):
                for selector, properties in comp_data.get('css_rules', {}).items():
                    for prop_name in properties:
                        property_usage[prop_name] = property_usage.get(prop_name, 0) + 1
        
        # Show top 20 most used properties
        sorted_props = sorted(property_usage.items(), key=lambda x: x[1], reverse=True)
        for i, (prop, count) in enumerate(sorted_props[:20], 1):
            print(f"{i:2d}. {prop}: {count} components")

if __name__ == "__main__":
    main()