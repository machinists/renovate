Renovate supports updating of Docker dependencies within Concourse Pipeline (`pipeline.yaml`) files.
Updates are performed if the file contains the conventional `docker-image` resource types:

```yaml
resource_types:
  - name: pull-request
    type: docker-image
    source:
      repository: teliaoss/github-pr-resource
      tag: v0.19.1
```

If you need to change the versioning format, read the [versioning](https://docs.renovatebot.com/modules/versioning/) documentation to learn more.
