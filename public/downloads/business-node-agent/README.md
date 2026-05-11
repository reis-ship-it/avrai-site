# AVRAI Business Node Agent Downloads

This directory is populated by:

```bash
dart run work/scripts/package_business_distribution.dart
```

The script compiles the current-host `avrai_business_node_agent` executable,
copies it into this website download tree, publishes service templates for
always-on device-node installation, and writes `download_manifest.json`.

Generated binaries, service templates, and manifests are intentionally ignored
by git. They are release artifacts, not source files.
