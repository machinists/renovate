import is from '@sindresorhus/is';
import { load } from 'js-yaml';
import { logger } from '../../logger';
import { id as dockerVersioning } from '../../versioning/docker';
import { getDep } from '../dockerfile/extract';
import type { PackageDependency, PackageFile } from '../types';
import type {
  ConcourseDockerImageDependency,
  ConcoursePipeline,
} from './types';

function getConcourseDep({
  registry,
  repository,
  tag,
}: {
  registry: string;
  repository: string;
  tag: string;
}): PackageDependency {
  const dep = getDep(`${registry}${repository}:${tag}`, false);
  dep.replaceString = tag;
  dep.versioning = dockerVersioning;
  dep.autoReplaceStringTemplate =
    '{{newValue}}{{#if newDigest}}@{{newDigest}}{{/if}}';
  return dep;
}

export function extractPackageFile(
  content: string,
  fileName?: string
): PackageFile {
  logger.debug('concourse-resources.extractPackageFile()');
  const deps: PackageDependency[] = [];
  let pipeline: ConcoursePipeline;
  try {
    // TODO: fix me (#9610)
    pipeline = load(content, { json: true }) as ConcoursePipeline;
    if (!pipeline) {
      logger.debug(
        { fileName },
        'Null config when parsing Concourse Pipeline content'
      );
      return null;
    }
    if (typeof pipeline !== 'object') {
      logger.debug(
        { fileName, type: typeof pipeline },
        'Unexpected type for Concourse Pipeline content'
      );
      return null;
    }
  } catch (err) {
    logger.debug({ err }, 'err');
    logger.debug({ fileName }, 'Parsing Concourse Pipeline config YAML');
    return null;
  }
  try {
    // TODO: Handle registry-image type too
    deps.push(
      ...Object.values(pipeline.resource_types || {})
        .filter(
          (service) =>
            is.string(service?.type) && service?.type === 'docker-image'
        )
        .map((service) => {
          const dockerImage = service.source as ConcourseDockerImageDependency;
          let registry: string = dockerImage.registry_mirror;
          registry = registry ? `${registry}/` : '';
          const repository = String(dockerImage.repository);
          const tag = String(dockerImage.tag);
          return getConcourseDep({ repository, tag, registry });
        })
        .filter(Boolean)
    );

    logger.trace({ deps }, 'Concourse resource type');
    return { deps };
  } catch (err) /* istanbul ignore next */ {
    logger.warn(
      { fileName, content, err },
      'Error extracting Concourse Pipeline file'
    );
  }
  return null;
}
