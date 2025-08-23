interface WidgetMetadata {
	id: string;
	name: string;
	description: string;
	component?: any; // Svelte component
	isPlaceholder: boolean;
	category: 'placeholder' | 'interactive' | 'data' | 'media';
	version: string;
	author?: string;
	dependencies?: string[];
}

interface WidgetRegistryConfig {
	maxWidgets: number;
	defaultWidgetCount: number;
	enabledCategories: WidgetMetadata['category'][];
}

class WidgetRegistry {
	private widgets = new Map<string, WidgetMetadata>();
	private config: WidgetRegistryConfig = {
		maxWidgets: 10,
		defaultWidgetCount: 5,
		enabledCategories: ['placeholder', 'interactive', 'data', 'media']
	};

	constructor() {
		this.registerDefaultWidgets();
	}

	private registerDefaultWidgets() {
		// Register placeholder widgets
		for (let i = 0; i < 5; i++) {
			this.register({
				id: `placeholder-${i}`,
				name: `Placeholder Widget ${i + 1}`,
				description: `A colorful placeholder widget for testing and demonstration purposes`,
				isPlaceholder: true,
				category: 'placeholder',
				version: '1.0.0',
				author: 'Widget System'
			});
		}
	}

	register(metadata: WidgetMetadata): void {
		if (this.widgets.has(metadata.id)) {
			console.warn(`Widget with ID "${metadata.id}" is already registered. Overwriting.`);
		}
		
		this.widgets.set(metadata.id, { ...metadata });
		console.log(`Registered widget: ${metadata.name} (${metadata.id})`);
	}

	unregister(id: string): boolean {
		const success = this.widgets.delete(id);
		if (success) {
			console.log(`Unregistered widget: ${id}`);
		} else {
			console.warn(`Widget with ID "${id}" not found for unregistration`);
		}
		return success;
	}

	get(id: string): WidgetMetadata | undefined {
		return this.widgets.get(id);
	}

	getAll(): WidgetMetadata[] {
		return Array.from(this.widgets.values());
	}

	getByCategory(category: WidgetMetadata['category']): WidgetMetadata[] {
		return this.getAll().filter(widget => widget.category === category);
	}

	getEnabled(): WidgetMetadata[] {
		return this.getAll().filter(widget => 
			this.config.enabledCategories.includes(widget.category)
		);
	}

	getPlaceholders(): WidgetMetadata[] {
		return this.getByCategory('placeholder');
	}

	setConfig(newConfig: Partial<WidgetRegistryConfig>): void {
		this.config = { ...this.config, ...newConfig };
	}

	getConfig(): WidgetRegistryConfig {
		return { ...this.config };
	}

	// Utility methods for widget management
	getAvailableWidgets(count: number): WidgetMetadata[] {
		const enabled = this.getEnabled();
		const maxCount = Math.min(count, this.config.maxWidgets, enabled.length);
		
		// For now, prioritize placeholders, but this can be extended
		const placeholders = this.getPlaceholders().slice(0, maxCount);
		
		// If we need more widgets, we can add interactive ones later
		if (placeholders.length < maxCount) {
			const interactive = this.getByCategory('interactive').slice(0, maxCount - placeholders.length);
			return [...placeholders, ...interactive];
		}
		
		return placeholders;
	}

	validateWidget(metadata: WidgetMetadata): { isValid: boolean; errors: string[] } {
		const errors: string[] = [];

		if (!metadata.id || metadata.id.trim() === '') {
			errors.push('Widget ID is required');
		}

		if (!metadata.name || metadata.name.trim() === '') {
			errors.push('Widget name is required');
		}

		if (!metadata.version || metadata.version.trim() === '') {
			errors.push('Widget version is required');
		}

		if (!['placeholder', 'interactive', 'data', 'media'].includes(metadata.category)) {
			errors.push('Invalid widget category');
		}

		return {
			isValid: errors.length === 0,
			errors
		};
	}

	// Debug and development helpers
	listWidgets(): void {
		console.group('Registered Widgets');
		this.getAll().forEach(widget => {
			console.log(`${widget.name} (${widget.id}) - ${widget.category} - v${widget.version}`);
		});
		console.groupEnd();
	}

	getStats(): { total: number; byCategory: Record<string, number> } {
		const all = this.getAll();
		const byCategory: Record<string, number> = {};

		all.forEach(widget => {
			byCategory[widget.category] = (byCategory[widget.category] || 0) + 1;
		});

		return {
			total: all.length,
			byCategory
		};
	}
}

// Create and export singleton instance
export const widgetRegistry = new WidgetRegistry();

// Export types for external use
export type { WidgetMetadata, WidgetRegistryConfig };