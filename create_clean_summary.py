#!/usr/bin/env python3
"""
Create a clean, human-readable summary of the CSS extraction results
"""

import json
from collections import Counter, defaultdict

def create_summary_report(json_file_path: str, output_file: str):
    """Create a clean summary report"""
    
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# Svelte Components CSS Analysis Report\n\n")
        
        # Overview Statistics
        f.write("## Overview\n")
        f.write(f"- **Total Components**: {data['metadata']['total_components']}\n")
        f.write(f"- **Components with Styles**: {data['metadata']['components_with_styles']}\n")
        f.write(f"- **Components without Styles**: {data['metadata']['total_components'] - data['metadata']['components_with_styles']}\n")
        f.write(f"- **Total CSS Properties Found**: {data['metadata']['total_css_properties']}\n\n")
        
        # CSS Properties Analysis
        f.write("## CSS Properties Analysis\n\n")
        
        # Count property usage
        property_usage = Counter()
        custom_properties = set()
        
        for comp_data in data['components'].values():
            if comp_data.get('has_styles', False):
                for selector, properties in comp_data.get('css_rules', {}).items():
                    for prop_name, prop_value in properties.items():
                        property_usage[prop_name] += 1
                        # Check for CSS custom properties usage
                        if 'var(--' in prop_value:
                            import re
                            vars_found = re.findall(r'var\((--[^,)]+)', prop_value)
                            custom_properties.update(vars_found)
        
        # Most used properties
        f.write("### Most Used CSS Properties\n")
        for i, (prop, count) in enumerate(property_usage.most_common(20), 1):
            percentage = (count / data['metadata']['components_with_styles']) * 100
            f.write(f"{i:2d}. **{prop}**: {count} components ({percentage:.1f}%)\n")
        f.write("\n")
        
        # CSS Custom Properties (tokens)
        if custom_properties:
            f.write("### CSS Custom Properties (Design Tokens)\n")
            sorted_tokens = sorted(list(custom_properties))
            
            # Group tokens by category
            token_categories = defaultdict(list)
            for token in sorted_tokens:
                if token.startswith('--bg-'):
                    token_categories['Background'].append(token)
                elif token.startswith('--fg-'):
                    token_categories['Foreground/Text'].append(token)
                elif token.startswith('--fs-'):
                    token_categories['Font Size'].append(token)
                elif token.startswith('--fw-'):
                    token_categories['Font Weight'].append(token)
                elif token.startswith('--font-'):
                    token_categories['Font Family'].append(token)
                elif token.startswith('--bdr-'):
                    token_categories['Border'].append(token)
                elif token.startswith('--spc-') or token.startswith('--space-'):
                    token_categories['Spacing'].append(token)
                else:
                    token_categories['Other'].append(token)
            
            for category, tokens in sorted(token_categories.items()):
                f.write(f"\n**{category}**:\n")
                for token in tokens:
                    f.write(f"- `{token}`\n")
            f.write(f"\n**Total Custom Properties Found**: {len(custom_properties)}\n\n")
        else:
            f.write("### CSS Custom Properties (Design Tokens)\n")
            f.write("No CSS custom properties found in component styles.\n\n")
        
        # Component Complexity Analysis
        f.write("## Component Complexity Analysis\n\n")
        
        comp_complexity = []
        comp_property_diversity = []
        
        for comp_name, comp_data in data['components'].items():
            if comp_data.get('has_styles', False):
                rule_count = len(comp_data.get('css_rules', {}))
                
                # Count unique properties
                unique_props = set()
                for selector, properties in comp_data.get('css_rules', {}).items():
                    unique_props.update(properties.keys())
                
                comp_complexity.append((comp_name, rule_count))
                comp_property_diversity.append((comp_name, len(unique_props)))
        
        comp_complexity.sort(key=lambda x: x[1], reverse=True)
        comp_property_diversity.sort(key=lambda x: x[1], reverse=True)
        
        f.write("### Most Complex Components (by CSS rule count)\n")
        for i, (comp_name, rule_count) in enumerate(comp_complexity[:15], 1):
            f.write(f"{i:2d}. **{comp_name}**: {rule_count} CSS rules\n")
        f.write("\n")
        
        f.write("### Components with Most CSS Property Diversity\n")
        for i, (comp_name, prop_count) in enumerate(comp_property_diversity[:15], 1):
            f.write(f"{i:2d}. **{comp_name}**: {prop_count} unique CSS properties\n")
        f.write("\n")
        
        # Components without styles
        components_without_styles = [
            comp_name for comp_name, comp_data in data['components'].items() 
            if not comp_data.get('has_styles', False)
        ]
        
        if components_without_styles:
            f.write("### Components Without Styles\n")
            for comp_name in sorted(components_without_styles):
                f.write(f"- {comp_name}\n")
            f.write("\n")
        
        # CSS Categories Analysis
        f.write("## CSS Property Categories\n\n")
        
        layout_props = [p for p, c in property_usage.items() if p in [
            'display', 'position', 'top', 'right', 'bottom', 'left', 'z-index',
            'float', 'clear', 'overflow', 'overflow-x', 'overflow-y'
        ]]
        
        flexbox_props = [p for p, c in property_usage.items() if p in [
            'flex', 'flex-direction', 'flex-wrap', 'flex-flow', 'justify-content',
            'align-items', 'align-content', 'align-self', 'flex-grow', 'flex-shrink', 'flex-basis'
        ]]
        
        spacing_props = [p for p, c in property_usage.items() if any(p.startswith(prefix) for prefix in [
            'margin', 'padding', 'gap'
        ])]
        
        typography_props = [p for p, c in property_usage.items() if any(p.startswith(prefix) for prefix in [
            'font', 'text', 'line-height', 'letter-spacing', 'word-spacing'
        ])]
        
        color_props = [p for p, c in property_usage.items() if p in [
            'color', 'background', 'background-color', 'border-color', 'outline-color'
        ]]
        
        if layout_props:
            f.write(f"**Layout Properties** ({len(layout_props)}): {', '.join(layout_props)}\n\n")
        if flexbox_props:
            f.write(f"**Flexbox Properties** ({len(flexbox_props)}): {', '.join(flexbox_props)}\n\n")
        if spacing_props:
            f.write(f"**Spacing Properties** ({len(spacing_props)}): {', '.join(spacing_props)}\n\n")
        if typography_props:
            f.write(f"**Typography Properties** ({len(typography_props)}): {', '.join(typography_props)}\n\n")
        if color_props:
            f.write(f"**Color Properties** ({len(color_props)}): {', '.join(color_props)}\n\n")
        
        # File structure analysis
        f.write("## Component Organization\n\n")
        
        directories = defaultdict(list)
        for comp_name, comp_data in data['components'].items():
            rel_path = comp_data.get('relative_path', '')
            if '/' in rel_path:
                directory = '/'.join(rel_path.split('/')[:-1])
                directories[directory].append((comp_name, comp_data.get('has_styles', False)))
            else:
                directories['root'].append((comp_name, comp_data.get('has_styles', False)))
        
        for directory, components in sorted(directories.items()):
            styled_count = sum(1 for _, has_styles in components if has_styles)
            total_count = len(components)
            f.write(f"**{directory}/** ({styled_count}/{total_count} with styles)\n")
            for comp_name, has_styles in sorted(components):
                status = "✓" if has_styles else "○"
                f.write(f"  {status} {comp_name}\n")
            f.write("\n")
    
    print(f"Summary report created: {output_file}")

def main():
    json_file = "/Users/peterabbott/folio/svelte-folio/css_extraction_results.json"
    summary_file = "/Users/peterabbott/folio/svelte-folio/CSS_Analysis_Summary.md"
    
    create_summary_report(json_file, summary_file)

if __name__ == "__main__":
    main()