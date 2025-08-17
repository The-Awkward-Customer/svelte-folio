#!/usr/bin/env python3
"""
Convert extracted CSS data from JSON to CSV format
"""

import json
import csv
from pathlib import Path

def create_csv_from_json(json_file_path: str, output_dir: str = "."):
    """Convert JSON data to CSV files"""
    
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    output_dir = Path(output_dir)
    output_dir.mkdir(exist_ok=True)
    
    # Create property-centric CSV (CSS properties as rows, components as columns)
    property_csv_path = output_dir / "css_properties_by_component.csv"
    
    with open(property_csv_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        
        # Write headers
        headers = data['csv_data']['property_rows']['headers']
        writer.writerow(headers)
        
        # Write data rows
        for row in data['csv_data']['property_rows']['data']:
            writer.writerow(row)
    
    # Create component-centric CSV (components as rows, CSS properties as columns)
    component_csv_path = output_dir / "components_by_css_properties.csv"
    
    with open(component_csv_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        
        # Write headers
        headers = data['csv_data']['component_rows']['headers']
        writer.writerow(headers)
        
        # Write data rows
        for row in data['csv_data']['component_rows']['data']:
            writer.writerow(row)
    
    # Create a summary CSV with component metadata
    summary_csv_path = output_dir / "component_summary.csv"
    
    with open(summary_csv_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        
        # Write headers
        writer.writerow(['Component', 'File Path', 'Has Styles', 'CSS Rules Count', 'Unique Properties Count'])
        
        # Write component data
        for comp_name, comp_data in data['components'].items():
            css_rules_count = len(comp_data.get('css_rules', {}))
            unique_props = set()
            
            for selector, properties in comp_data.get('css_rules', {}).items():
                unique_props.update(properties.keys())
            
            writer.writerow([
                comp_name,
                comp_data.get('relative_path', ''),
                comp_data.get('has_styles', False),
                css_rules_count,
                len(unique_props)
            ])
    
    # Create a detailed CSS rules CSV
    detailed_csv_path = output_dir / "detailed_css_rules.csv"
    
    with open(detailed_csv_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        
        # Write headers
        writer.writerow(['Component', 'Selector', 'Property', 'Value', 'File Path'])
        
        # Write detailed data
        for comp_name, comp_data in data['components'].items():
            if not comp_data.get('has_styles', False):
                continue
                
            file_path = comp_data.get('relative_path', '')
            
            for selector, properties in comp_data.get('css_rules', {}).items():
                for prop_name, prop_value in properties.items():
                    writer.writerow([comp_name, selector, prop_name, prop_value, file_path])
    
    # Create CSS custom properties (tokens) analysis
    tokens_csv_path = output_dir / "css_custom_properties.csv"
    
    with open(tokens_csv_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        
        # Write headers
        writer.writerow(['Component', 'Selector', 'Property', 'Custom Property Used', 'Full Value', 'File Path'])
        
        # Extract custom properties (CSS variables)
        for comp_name, comp_data in data['components'].items():
            if not comp_data.get('has_styles', False):
                continue
                
            file_path = comp_data.get('relative_path', '')
            
            for selector, properties in comp_data.get('css_rules', {}).items():
                for prop_name, prop_value in properties.items():
                    # Look for var() usage
                    if 'var(' in prop_value:
                        import re
                        # Extract all var() references
                        var_matches = re.findall(r'var\((--[^,)]+)', prop_value)
                        for var_name in var_matches:
                            writer.writerow([comp_name, selector, prop_name, var_name, prop_value, file_path])
                    elif prop_value.startswith('--'):
                        # CSS custom property definition
                        writer.writerow([comp_name, selector, prop_name, prop_value, prop_value, file_path])
    
    print(f"Created CSV files:")
    print(f"  1. {property_csv_path} - CSS properties as rows, components as columns")
    print(f"  2. {component_csv_path} - Components as rows, CSS properties as columns") 
    print(f"  3. {summary_csv_path} - Component metadata summary")
    print(f"  4. {detailed_csv_path} - Detailed CSS rules breakdown")
    print(f"  5. {tokens_csv_path} - CSS custom properties/tokens analysis")
    
    return {
        'property_matrix': property_csv_path,
        'component_matrix': component_csv_path,
        'summary': summary_csv_path,
        'detailed': detailed_csv_path,
        'tokens': tokens_csv_path
    }

def print_statistics(json_file_path: str):
    """Print useful statistics about the CSS data"""
    
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"\n=== CSS EXTRACTION STATISTICS ===")
    print(f"Total Components: {data['metadata']['total_components']}")
    print(f"Components with Styles: {data['metadata']['components_with_styles']}")
    print(f"Components without Styles: {data['metadata']['total_components'] - data['metadata']['components_with_styles']}")
    print(f"Total CSS Properties Found: {data['metadata']['total_css_properties']}")
    
    # Count CSS custom properties
    custom_props = [prop for prop in data['metadata']['css_properties'] if prop.startswith('--')]
    print(f"CSS Custom Properties (tokens): {len(custom_props)}")
    
    # Count vendor prefixed properties
    vendor_props = [prop for prop in data['metadata']['css_properties'] if prop.startswith(('-webkit-', '-moz-', '-ms-'))]
    print(f"Vendor Prefixed Properties: {len(vendor_props)}")
    
    # Most complex components (by CSS rule count)
    comp_complexity = []
    for comp_name, comp_data in data['components'].items():
        if comp_data.get('has_styles', False):
            rule_count = len(comp_data.get('css_rules', {}))
            comp_complexity.append((comp_name, rule_count))
    
    comp_complexity.sort(key=lambda x: x[1], reverse=True)
    
    print(f"\nMost Complex Components (by CSS rule count):")
    for i, (comp_name, rule_count) in enumerate(comp_complexity[:10], 1):
        print(f"{i:2d}. {comp_name}: {rule_count} CSS rules")

def main():
    json_file = "/Users/peterabbott/folio/svelte-folio/css_extraction_results.json"
    output_directory = "/Users/peterabbott/folio/svelte-folio/csv_output"
    
    print("Converting JSON to CSV...")
    csv_files = create_csv_from_json(json_file, output_directory)
    
    print_statistics(json_file)
    
    print(f"\n=== FILES CREATED ===")
    for csv_type, file_path in csv_files.items():
        print(f"{csv_type}: {file_path}")

if __name__ == "__main__":
    main()