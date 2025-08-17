import godeskHero from '$lib/assets/project_images/godesk-hero.jpg';
import freshaHero from '$lib/assets/project_images/fresha-hero.jpg';
import jioHero from '$lib/assets/project_images/jio-hero.jpg';
import ikeaPoster from '$lib/assets/project_images/ikea-poster.jpg';
import skappaVideo from '$lib/assets/skappa-video.mp4';
import warhammerVideo from '$lib/assets/warhammer-video.mp4';
import warhammerPoster from '$lib/assets/project_images/warhammer-poster.jpg';

export interface ProjectData {
  header: {
    imageSrc: string;
    imageAlt: string;
    mediaType?: 'image' | 'video';
    videoSrc?: string;
    videoPoster?: string;
  };
  body: {
    problemStatement: {
      title: string;
      content: string;
    };
    impact: {
      title: string;
      content: string[];
    };
    teamMembers: {
      title: string;
      members: { name: string; role: string }[];
    };
  };
  footer: {
    footerString: string;
  };
}

export const experienceData: Record<string, ProjectData> = {
  godesk: {
    header: {
      imageSrc: godeskHero,
      imageAlt: 'Godesk platform interface showcasing the support dashboard',
    },
    body: {
      problemStatement: {
        title: 'Problem Space',
        content:
          'The SME market was overserved by existing solutions. We hypothesized that there was a gap in the market for blue-collar businesses needing simple, affordable support and we could leverage AI to remove dedicated support staff.',
      },
      impact: {
        title: 'Impact',
        content: [
          '10X revenue growth to $3000+ MRR',
          'LLM Powered Knowledge base',
          'Profitable exit',
        ],
      },
      teamMembers: {
        title: 'Team Members',
        members: [
          { name: 'Tommy Roberts', role: 'Founder' },
          { name: 'Peter Abbott', role: 'Co-Founding Designer' },
          { name: 'Hayden Kerr', role: 'Developer' },
        ],
      },
    },
    footer: {
      footerString:
        "Despite achieving 900% sales growth, we never truly found product-market fit. We identified critical macroeconomic inflection points we couldn't overcome, coupled with increasingly aggressive incumbents in the customer support market. This experience taught me valuable lessons about startups, you can execute well, but if the timing isn't right, it simply isn't right.",
    },
  },
  fresha: {
    header: {
      imageSrc: freshaHero,
      imageAlt: 'Fresha design system components and style guide',
    },
    body: {
      problemStatement: {
        title: 'Problem Space',
        content:
          'Years of technical debt, and no source of truth was slowing Fresha down at a critical time. We rebuilt the Design System from the ground up to provide a scalable foundation for rapid global growth.',
      },
      impact: {
        title: 'Impact',
        content: [
          'Halved feature delivery time through systematic component consolidation (1000+ to 88)',
          'Implemented automation tooling reducing design changes from weeks to hours',
          'Created a single source of truth for feature teams.',
        ],
      },
      teamMembers: {
        title: 'Team Members',
        members: [
          { name: 'Peter Abbott', role: 'Lead product Designer' },
          { name: 'Matt Styles', role: 'Engineering Lead' },
          { name: 'Mathias Bercoux', role: 'Senior Designer' },
          { name: 'Darek Napłoszek', role: 'Senior Engineer' },
          { name: 'Patryk Wac', role: 'Engineer' },
        ],
      },
    },
    footer: {
      footerString:
        "The role started as Figma-focused and quickly evolved into managing a team and navigating complex organizational politics. The biggest challenge wasn't technical, rather culture and perception. Developers had witnessed three previous design system failures each one adding more mess. We solved this by partnering with one team first, proving value, then letting their advocacy drive adoption. I learned that design systems succeed by delivering world-class user experiences while also providing the path of least resistance internally for both designers and developers through clear communication and systematic guardrails.",
    },
  },
  jio: {
    header: {
      imageSrc: jioHero,
      imageAlt:
        'Jio Assist mobile interface showing network diagnostics and support workflows',
    },
    body: {
      problemStatement: {
        title: 'Problem Space',
        content:
          'Covid dramatically changed how Jio operated, requiring rapid adoption of remote first customer support and mobile workflows on performance sensitive devices.',
      },
      impact: {
        title: 'Impact',
        content: [
          '12% reduction in issue resolution time across all customer support teams',
          'Enabled entire Jio support workforce to transition from office-based to remote operations',
          'Increased customer satisfaction through streamlined mobile support workflows',
        ],
      },
      teamMembers: {
        title: 'Team Members',
        members: [
          { name: 'Fillipo Del Carlo', role: 'Principal Product Designer' },
          { name: 'Peter Abbott', role: 'Senior Product Designer' },
          { name: 'Prateek Dave', role: 'Senior UI Designer' },
          { name: 'Philipp Kreicarek', role: 'UX Architect' },
          { name: 'Priya Prakash', role: 'Copywriter' },
        ],
      },
    },
    footer: {
      footerString:
        "The biggest challenge wasn't technical—it was research. Cultural tendencies to agree with authority figures made user testing unreliable, forcing us to pivot to quantitative metrics and behavioral observation. Moving from data-rich desktop dashboards to performance-constrained mobile devices required rethinking every workflow. I learned that successful transformation isn't just about the interface—it's about understanding the cultural and technical realities your users actually face. The gamification features I implemented, while popular in surveys, likely increased employee pressure rather than engagement—a reminder that user feedback and user impact aren't always aligned.",
    },
  },
  ikea: {
    header: {
      imageSrc: ikeaPoster,
      imageAlt:
        'IKEA design system motion graphics storyboard and visual narrative',
      mediaType: 'video',
      videoSrc: skappaVideo,
      videoPoster: ikeaPoster,
    },
    body: {
      problemStatement: {
        title: 'Problem Space',
        content:
          'IKEA needed to communicate the value of their design system to internal stakeholders in a compelling way that transcended traditional documentation.',
      },
      impact: {
        title: 'Impact',
        content: [
          'Successfully communicated complex design system value to company stakeholders in concise visual format',
          'Created internal awareness piece that promoted design system adoption across teams',
          'Delivered complete motion graphics narrative in 2-week turnaround with limited assets',
        ],
      },
      teamMembers: {
        title: 'Team Members',
        members: [
          { name: 'Fredrik Stahre', role: 'Programme Director' },
          { name: 'Peter Abbott', role: 'Creative Director' },
          { name: 'Landor Group', role: 'Production' },
        ],
      },
    },
    footer: {
      footerString:
        'This project taught me the power of creative constraints. With only 2 weeks and limited design system access, we had to work with existing assets and make magic happen. The challenge wasn\'t technical—it was narrative. Finding the right visual and musical tempo while capturing that distinctly Nordic "playful wrongness" pushed me beyond traditional UI handoffs into storyboarding and golden frame thinking. Ironically, the lack of direct design system team access forced us to interpret their work more creatively, resulting in what remains one of my favorite projects. Sometimes limitations become the catalyst for the most innovative solutions.',
    },
  },
  warhammer: {
    header: {
      imageSrc: warhammerPoster,
      imageAlt:
        'Warhammer e-commerce interface showing game system hierarchy and product visualization',
      mediaType: 'video',
      videoSrc: warhammerVideo,
      videoPoster: warhammerPoster,
    },
    body: {
      problemStatement: {
        title: 'Problem Space',
        content:
          'The Warhammer e-commerce platform needed a comprehensive UX overhaul to improve user engagement and streamline the purchasing process.',
      },
      impact: {
        title: 'Impact',
        content: [
          'Secured multi-year digital transformation contract for AKQA through comprehensive UX strategy',
          'Architected information hierarchy for complex game systems and sub-faction interoperability',
          'Pioneered innovative features including accurate paint color rendering and interactive model visualization',
        ],
      },
      teamMembers: {
        title: 'Team Members',
        members: [
          { name: 'Paul Ostryzniuk', role: 'Creative Director' },
          { name: 'Leo Thorten', role: 'Senior UX Architect' },
          { name: 'Peter Abbott', role: 'Senior Designer' },
        ],
      },
    },
    footer: {
      footerString:
        "Typically what gets ideated and what gets shipped can be worlds apart. We pushed boundaries with paint color accuracy and interactive model breakdowns, but the final implementation fell short due to Games Workshop's internal content generation capabilities. The most challenging aspect was the technical complexity vs in-house competency. Warhammer is a complex IP and defining a coherent purchasing funnel for multiple interconnected game systems and sub-factions was another key challenge, yet one the nerd in me relished. I had very high hopes for this project and believe the final implementation a true technical improvement but one lacking polish.",
    },
  },
};
