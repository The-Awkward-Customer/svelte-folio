<script>
  import ArticleLayout from "$lib/components/article/ArticleLayout.svelte";
  import ArticleBody from "$lib/components/article/ArticleBody.svelte";
  import ArticleSection from "$lib/components/article/ArticleSection.svelte";
  import ArticleHeader from "$lib/components/article/ArticleHeader.svelte";
  import ArticleText from "$lib/components/article/ArticleText.svelte";
  import ArticleImage from "$lib/components/article/ArticleImage.svelte";
  import ArticleList from "$lib/components/article/ArticleList.svelte";
  import ArticleOrnament from "$lib/components/article/ArticleOrnament.svelte";
  import ArticleTableOfContents from "$lib/components/article/ArticleTableOfContents.svelte";

  // Table of contents data
  const tocItems = [
    { id: "introduction", title: "Introduction" },
    { id: "hierarchy", title: "Understanding Hierarchy" },
    { id: "principles", title: "Typography Principles" },
    { id: "technical", title: "Technical Considerations" },
    { id: "conclusion", title: "Looking Forward" },
  ];
</script>

<svelte:head>
  <title>Sample Article - Typography Showcase</title>
  <meta
    name="description"
    content="A demonstration of article typography components"
  />
</svelte:head>

<ArticleLayout>
  {#snippet sidebar()}
    <ArticleTableOfContents items={tocItems} />
  {/snippet}

  <ArticleBody>
    <ArticleHeader
      title="The Art of Digital Typography"
      author="Peter Abbott"
      date="September 22, 2025"
    />

    <ArticleSection id="introduction">
      <ArticleText>
        Typography in the digital age has evolved far beyond mere text display.
        It has become a sophisticated art form that bridges the gap between
        technology and human expression, creating experiences that are both
        functional and beautiful.
      </ArticleText>

      <ArticleText>
        In this exploration, we'll dive deep into the principles that make
        digital typography not just readable, but truly engaging. From the
        subtle nuances of line height to the bold statements made by typeface
        choices, every element contributes to the reader's journey.
      </ArticleText>
    </ArticleSection>

    <ArticleOrnament />

    <ArticleSection id="hierarchy">
      <ArticleText subtitle="The Foundation: Understanding Hierarchy">
        Visual hierarchy forms the backbone of effective typography. It guides
        the reader's eye through content in a logical, intuitive manner.
        Consider how different text sizes, weights, and spacing create a natural
        flow that enhances comprehension.
      </ArticleText>

      <ArticleImage
        caption="Visual hierarchy demonstration with different text treatments"
        width="full"
        alignment="center"
      />

      <ArticleText>
        The principles of hierarchy extend beyond simple size differences.
        Color, contrast, and whitespace all play crucial roles in creating clear
        information architecture that serves both aesthetic and functional
        purposes.
      </ArticleText>
    </ArticleSection>

    <ArticleSection id="principles">
      <ArticleText subtitle="principles">
        Successful digital typography relies on several core principles that
        have been refined through decades of design evolution:
      </ArticleText>

      <ArticleList
        type="ordered"
        items={[
          "Readability: Ensuring text is easily scannable and digestible",
          "Consistency: Maintaining uniform styling throughout the experience",
          "Contrast: Creating clear distinctions between different content types",
          "Rhythm: Establishing a consistent vertical flow through spacing",
          "Personality: Allowing the typeface to reflect the content's tone",
        ]}
      />

      <ArticleText>
        "Typography is the craft of endowing human language with a durable
        visual form, and thus with an independent existence." — Robert
        Bringhurst
      </ArticleText>

      <ArticleText>
        These principles work together to create typography that doesn't just
        convey information, but enhances the reader's understanding and
        emotional connection to the content.
      </ArticleText>
    </ArticleSection>

    <ArticleOrnament />

    <ArticleSection id="technical">
      <ArticleText subtitle="Technical Considerations">
        Modern web typography involves numerous technical considerations that
        directly impact the reading experience:
      </ArticleText>

      <ArticleList
        type="unordered"
        items={[
          "Font Loading: Optimizing for performance while maintaining design integrity",
          "Responsive Scaling: Ensuring readability across all device sizes",
          "Accessibility: Supporting users with diverse visual needs",
          "Browser Compatibility: Maintaining consistency across platforms",
        ]}
      />

      <ArticleImage
        caption="Responsive typography scaling across different devices"
        width="full"
        alignment="center"
      />

      <ArticleText>
        The intersection of design and technology requires careful balance.
        While we have unprecedented control over typography, we must also
        consider performance, accessibility, and the diverse contexts in which
        our text will be consumed.
      </ArticleText>
    </ArticleSection>

    <ArticleOrnament />

    <ArticleSection id="conclusion">
      <ArticleText subtitle="Looking Forward">
        As we continue to push the boundaries of digital design, typography
        remains our most fundamental tool for communication. The components and
        principles we've explored here provide a foundation for creating text
        that is not only beautiful, but truly functional.
      </ArticleText>

      <ArticleText>
        The future of digital typography lies in the thoughtful application of
        these timeless principles, enhanced by modern technology and an
        ever-deepening understanding of human perception and interaction.
      </ArticleText>
    </ArticleSection>

    <ArticleOrnament />
  </ArticleBody>
</ArticleLayout>
