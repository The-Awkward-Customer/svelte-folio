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
    standfirst: string;
    content: string;
    mediaType?: 'image' | 'video';
    videoSrc?: string;
    videoPoster?: string;
  };
  body: {
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
      standfirst: '900% growth, valuable lessons, and the wisdom to know when timing beats execution.',
      content: 'As co-founding designer at GoDesk, I was responsible for defining the business\'s strategic playbook, market fit, and brand positioning. I oversaw customer research implementation, a complete rebrand, and delivery of the product\'s first ML-powered features. Over eight months, we achieved significant revenue and user growth through various strategies but ultimately couldn\'t compete with existing incumbents. We simply didnt have the compute, so we decided to exit with our remaining capital.'
    },
    body: {
      impact: {
        title: 'Impact',
        content: ['10X revenue growth to $300+ MRR']
      },
      teamMembers: {
        title: 'Team Members',
        members: [
          { name: 'Tommy Roberts', role: 'Founder' },
          { name: 'Hayden Kerr', role: 'Developer' },
        ]
      }
    },
    footer: {
      footerString: 'Despite achieving 900% sales growth, we never truly found product-market fit. We identified critical macroeconomic inflection points we couldn\'t overcome, coupled with increasingly entrenched incumbents in the customer support market. This experience taught me invaluable lessons about startup dynamics—sometimes you can execute well, but if the timing isn\'t right, it simply isn\'t right.'
    }
  },
  fresha: {
    header: {
      imageSrc: freshaHero,
      imageAlt: 'Fresha design system components and style guide',
      standfirst: 'Bringing order to design complexity—from fragmented systems to unified clarity at scale.',
      content: 'As Lead Product Designer at Fresha, I inherited a fragmented design ecosystem with 1000+ inconsistent components across three failed previous attempts at systematization. Over 18 months, I built and led a team of 4 (3 engineers, 1 designer) to architect a comprehensive design system serving 130+ global team members and customers across 120 countries.'
    },
    body: {
      impact: {
        title: 'Impact',
        content: ['Cut front-end bugs by 95% and halved feature delivery time through systematic component reduction (1000+ to 88)','Created federated governance and automation that continues enabling Fresha\'s global expansion 2+ years later']
      },
      teamMembers: {
        title: 'Team Members',
        members: [
          { name: 'Alex Thompson', role: 'Head of Design' },
          { name: 'Priya Patel', role: 'Design Systems Engineer' },
          { name: 'Tom Wilson', role: 'Product Manager' },
          { name: 'Lisa Chen', role: 'Frontend Lead' }
        ]
      }
    },
    footer: {
      footerString: 'The role started as Figma-focused and quickly evolved into managing a team and navigating complex organizational politics. The biggest challenge wasn\'t technical—it was winning over developers who\'d witnessed three previous design system failures. We solved this by partnering with one skeptical team first, proving value, then letting their advocacy drive adoption. I learned that design systems succeed by delivering world-class user experiences while providing the path of least resistance for both designers and developers through clear communication and systematic guardrails.'
    }
  },
  jio: {
    header: {
      imageSrc: jioHero,
      imageAlt: 'Jio Assist mobile interface showing network diagnostics and support workflows',
      standfirst: 'Transforming data-heavy desktop workflows into mobile-first experiences for India\'s largest telecom workforce.',
      content: 'As Senior Product Designer at Jio, I led the digital transformation of customer support tools during their shift to remote work. Over 7 months, I redesigned data-dense desktop dashboards into mobile-first experiences for field support staff, navigating cultural research challenges and performance constraints while delivering the JIO Assist product suite that enabled thousands of employees to work remotely for the first time.'
    },
    body: {
      impact: {
        title: 'Impact',
        content: [
          '12% reduction in issue resolution time across all customer support teams',
          'Enabled entire Jio support workforce to transition from office-based to remote operations',
          'Increased customer satisfaction through streamlined mobile support workflows'
        ]
      },
      teamMembers: {
        title: 'Team Members',
        members: [
          { name: 'Arjun Patel', role: 'Creative Director' },
          { name: 'Priya Sharma', role: 'Principal Product Designer' },
          { name: 'Rajesh Kumar', role: 'In-house Systems Expert' },
          { name: 'Lisa Chen', role: 'Project Coordinator' }
        ]
      }
    },
    footer: {
      footerString: 'The biggest challenge wasn\'t technical—it was research. Cultural tendencies to agree with authority figures made user testing unreliable, forcing us to pivot to quantitative metrics and behavioral observation. Moving from data-rich desktop dashboards to performance-constrained mobile devices required rethinking every workflow. I learned that successful transformation isn\'t just about the interface—it\'s about understanding the cultural and technical realities your users actually face. The gamification features I implemented, while popular in surveys, likely increased employee pressure rather than engagement—a reminder that user feedback and user impact aren\'t always aligned.'
    }
  },
  ikea: {
    header: {
      imageSrc: ikeaPoster,
      imageAlt: 'IKEA design system motion graphics storyboard and visual narrative',
      standfirst: 'Translating design system complexity into compelling visual storytelling for company stakeholders.',
      content: 'As Creative Director for IKEA, I crafted a motion graphics piece communicating their design system\'s value to company stakeholders during a digital innovation showcase. Over 2 weeks, I developed a visual narrative working backwards from consumer interfaces to tell the story of "collaboration by the many for the many," emphasizing modularity and the iconic IKEA effect through storyboarding, golden frame identification, and Nordic-inspired visual rhythm.',
      mediaType: 'video',
      videoSrc: skappaVideo,
      videoPoster: ikeaPoster
    },
    body: {
      impact: {
        title: 'Impact',
        content: [
          'Successfully communicated complex design system value to company stakeholders in concise visual format',
          'Created internal awareness piece that promoted design system adoption across teams',
          'Delivered complete motion graphics narrative in 2-week turnaround with limited assets'
        ]
      },
      teamMembers: {
        title: 'Team Members',
        members: [
          { name: 'Maria Andersson', role: 'Motion Graphics Lead' },
          { name: 'Erik Johansson', role: 'Brand Strategy' },
          { name: 'Sophie Laurent', role: 'Project Coordinator' },
          { name: 'Lars Nilsson', role: 'Design System Liaison' }
        ]
      }
    },
    footer: {
      footerString: 'This project taught me the power of creative constraints. With only 2 weeks and limited design system access, we had to work with existing assets and make magic happen. The challenge wasn\'t technical—it was narrative. Finding the right visual and musical tempo while capturing that distinctly Nordic "playful wrongness" pushed me beyond traditional UI handoffs into storyboarding and golden frame thinking. Ironically, the lack of direct design system team access forced us to interpret their work more creatively, resulting in what remains one of my favorite projects. Sometimes limitations become the catalyst for the most innovative solutions.'
    }
  },
  warhammer: {
    header: {
      imageSrc: warhammerPoster,
      imageAlt: 'Warhammer e-commerce interface showing game system hierarchy and product visualization',
      standfirst: 'Architecting digital commerce for one of gaming\'s most complex ecosystems after decades of stagnation.',
      content: 'As Senior Product Designer at Games Workshop, I spearheaded the information architecture for their digital transformation initiative. Over 5 months, I leveraged deep hobby knowledge and design systems expertise to restructure their e-commerce experience, tackling complex game system hierarchies, sub-faction interoperability, and innovative features like accurate paint color rendering and interactive model breakdowns.',
      mediaType: 'video',
      videoSrc: warhammerVideo,
      videoPoster: warhammerPoster
    },
    body: {
      impact: {
        title: 'Impact',
        content: [
          'Secured multi-year digital transformation contract for AKQA through comprehensive UX strategy',
          'Architected information hierarchy for complex game systems and sub-faction interoperability',
          'Pioneered innovative features including accurate paint color rendering and interactive model visualization'
        ]
      },
      teamMembers: {
        title: 'Team Members',
        members: [
          { name: 'James Mitchell', role: 'Creative Director' },
          { name: 'Sarah Davies', role: 'Principal Product Designer' },
          { name: 'Marcus Chen', role: 'Motion Graphics Designer' },
          { name: 'Robert Clarke', role: 'Copywriter' }
        ]
      }
    },
    footer: {
      footerString: 'This project taught me the harsh reality of transformation consulting—what gets ideated and what gets shipped can be worlds apart. We pushed boundaries with paint color accuracy and interactive model breakdowns, but the final implementation fell short due to Games Workshop\'s internal content generation capabilities. The most challenging aspect wasn\'t the technical complexity—it was architecting information hierarchy for decades of interconnected game systems and sub-factions. Information architecture, now a rare skill in digital design, proved critical for structuring such complex product relationships. Sometimes the best design strategy means nothing without the organizational capability to execute it properly.'
    }
  },
  shell: {
    header: {
      imageSrc: godeskHero, // Using placeholder for now
      imageAlt: 'Shell Fleet Hub interface showing card management and fleet optimization tools',
      standfirst: 'Transforming Shell from fuel card provider to comprehensive mobility solutions platform across 39 global markets.',
      content: 'As Senior UX Designer embedded at Shell for 18 months, I architected the design foundation for their Fleet Hub transformation serving 32 million customers across 39 markets and 44,000 retail outlets. I pioneered their first design system through the fleet management platform redesign, developed API/developer portal strategy during their "data as a service" pivot, and led the transition from Excel-based logistics workflows to integrated digital experiences with fuel card management, route optimization, and emerging mobility services.'
    },
    body: {
      impact: {
        title: 'Impact',
        content: [
          'Delivered design system prototype that secured company-wide digital transformation investment approval',
          'Transformed fleet card management platform serving millions across Europe, India, and China with 44,000 retail outlets',
          'Created pattern library that accelerated future Shell mobility services including tolls system development'
        ]
      },
      teamMembers: {
        title: 'Team Members',
        members: [
          { name: 'Sarah Mitchell', role: 'Senior Product Manager' },
          { name: 'David Chen', role: 'Principal Engineer' },
          { name: 'Maria Rodriguez', role: 'Business Strategy Lead' },
          { name: 'Tom Harrison', role: 'Data Architecture Lead' }
        ]
      }
    },
    footer: {
      footerString: 'This project taught me that "data is the new oil" isn\'t just a catchy phrase—it was Shell\'s literal business strategy during their mobility transition. The biggest challenge wasn\'t technical complexity, but organizational inertia at a 100+ year old company transitioning from fuel provider to comprehensive mobility services. Each division operated independently, creating massive fragmentation that required both design systems thinking and serious political navigation. My design system prototype became the proof point that secured enterprise-wide transformation investment. Watching manual Excel-based fleet management transform into an integrated platform while building API strategies for toll roads and fuel cost data felt like designing Shell\'s future as a mobility company, not just improving their fuel card business.'
    }
  },
  suzuki: {
    header: {
      imageSrc: freshaHero, // Using placeholder for now
      imageAlt: 'Suzuki multi-channel website interface showing cars, motorcycles, and marine configurators',
      standfirst: 'Unifying fragmented digital experiences across cars, motorcycles, and marine products through research-driven design.',
      content: 'As UX Designer at Foolproof for Suzuki, I led end-to-end customer experience design across four product divisions over 18 months. Using classic qualitative research cycles and double diamond methodology, I consolidated organic digital growth into cohesive experiences that connected online discovery with dealership purchases, creating scalable component systems that reduced site complexity by 75% while addressing distinct user needs across automotive and marine markets.'
    },
    body: {
      impact: {
        title: 'Impact',
        content: [
          '37% increase in test drive requests and 48% year-on-year increase in motorcycle leads',
          'Consolidated digital offering by 75% through component-based design system approach',
          'Successfully unified customer experience across cars, motorcycles, ATV, and marine product lines'
        ]
      },
      teamMembers: {
        title: 'Team Members',
        members: [
          { name: 'Tom Harman', role: 'Creative Director' },
          { name: 'Sophie Richards', role: 'Senior UX Designer' },
          { name: 'Ben Cooper', role: 'Strategy Lead' },
          { name: 'Alice Wong', role: 'Visual Designer' }
        ]
      }
    },
    footer: {
      footerString: 'This project reinforced the power of classic UX methodology—sometimes post-its on walls and proper research cycles trump flashy new techniques. The biggest insight was discovering how different vehicle buyers think: bike buyers craved rich visuals and 360° views, while car buyers needed comparative size information and practical details. Building a 70/30 component reuse strategy across product lines taught me that flexibility within systems is more valuable than rigid consistency. Most importantly, designing the digital-to-dealer handoff reminded me that great UX doesn\'t end at the screen—it extends into the real world where actual purchase decisions happen.'
    }
  },
  tsb: {
    header: {
      imageSrc: jioHero, // Using placeholder for now
      imageAlt: 'TSB mobile banking app interface showing demographic-targeted financial packages',
      standfirst: 'Designing innovative banking experiences that got lost in corporate politics and digital transformation failures.',
      content: 'As UX Designer at TSB, I spent 7 months delivering a comprehensive digital banking redesign during the critical period when challenger banks like Monzo were reshaping the market. I created a fully interactive design system, redesigned conversion funnels targeting five key demographics, and developed a mobile-first banking app with novel interaction design that could have differentiated TSB—before organizational politics and the Santander merger derailed the entire initiative.'
    },
    body: {
      impact: {
        title: 'Impact',
        content: [
          'Delivered rare fully interactive design system guidelines and demographic-targeted banking packages',
          'Created mobile-first banking app with novel interactions during crucial fintech disruption period',
          'Developed conversion funnel redesigns for five researched customer personas (student to grandparent segments)'
        ]
      },
      teamMembers: {
        title: 'Team Members',
        members: [
          { name: 'Michael Thompson', role: 'Project Lead' },
          { name: 'Sarah Collins', role: 'Senior UX Designer' },
          { name: 'David Chen', role: 'Visual Designer' },
          { name: 'Laura Johnson', role: 'User Researcher' }
        ]
      }
    },
    footer: {
      footerString: 'This project taught me that excellent design work means nothing without organizational buy-in and political navigation skills. We delivered innovative banking experiences during the fintech disruption moment—interactive design systems, demographic-targeted packages, novel mobile interactions—only to watch it all get shelved due to internal politics and merger chaos. The brand agency (co-owned by a board member) blocked our interactive animation proposals without reasoning, highlighting how traditional banking\'s risk-averse culture can kill innovation. This painful experience pushed me toward design engineering and learning to navigate organizations that actually deliver value to people. Eight years later, TSB still hasn\'t innovated—a sobering reminder that great design without great execution strategy is just expensive decoration.'
    }
  }
};