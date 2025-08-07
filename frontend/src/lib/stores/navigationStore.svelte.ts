let activeSection = $state('hero');

export const navigationStore = {
	get activeSection() {
		return activeSection;
	},
	set activeSection(value: string) {
		activeSection = value;
	}
};