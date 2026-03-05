declare module "@data/profile.json" {
  const value: {
    name: string;
    role: string;
    email: string;
    github: string;
    about: string;
    education: Array<{
      school: string;
      major: string;
      degree: string;
      period: string;
      status: string;
    }>;
    experience: Array<{
      title: string;
      company: string;
      period: string;
      description: string;
    }>;
    techStack: Record<string, string[]>;
  };
  export default value;
}

declare module "@data/projects.json" {
  import type { Project } from "@genie-cv/shared";
  const value: Project[];
  export default value;
}

declare module "@data/qna.json" {
  import type { QnAItem } from "@genie-cv/shared";
  const value: QnAItem[];
  export default value;
}
