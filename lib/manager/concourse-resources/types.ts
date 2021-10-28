export type ConcourseDependency = {
  name: string;
  type: string;
  source: ConcourseDockerImageDependency | ConcourseRegistryImageDependency;
};

export type ConcourseDockerImageDependency = {
  registry_mirror?: string;
  repository: string;
  tag: string;
};

// TODO: Support
export type ConcourseRegistryImageDependency = {
  // TODO: semver_constraint and variant
  registry_mirror?: string;
  repository: string;
  tag: string;
};
