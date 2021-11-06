export type ConcourseDockerImageDependency = {
  registry_mirror?: string;
  repository: string;
  tag: string;
};

export type ConcourseRegistryImageDependency = {
  registry_mirror?: string;
  repository: string;
  semver_constraint?: string;
  tag: string;
  variant?: string;
};

export type ConcourseDependency = {
  name: string;
  type: string;
  source: ConcourseDockerImageDependency | ConcourseRegistryImageDependency;
};

export type ConcoursePipeline = {
  resource_types: ConcourseDependency[];
};
