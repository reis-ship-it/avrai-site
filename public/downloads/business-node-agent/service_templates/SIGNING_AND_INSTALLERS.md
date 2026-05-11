# AVRAI Business Node Agent Signing and Installers

Generated at 2026-05-10T04:34:20.463445Z.

The local build is intentionally unsigned. Production distribution requires:

- macOS: sign the executable with Developer ID Application, notarize with
  `xcrun notarytool`, staple the ticket, then wrap the LaunchAgent plist in a
  signed `.pkg` or `.dmg`.
- Windows: sign the executable and installer with Authenticode and a timestamp
  server, then install the generated Windows service command.
- Linux: package the executable and systemd unit as `.deb`/`.rpm`, sign the
  repository metadata or package, and install the system service.

Current-host signing gates:

```bash
dart run tool/build_release.dart --sign --require-signed
```

macOS environment:

- `AVRAI_MACOS_SIGN_IDENTITY`
- `AVRAI_MACOS_NOTARY_PROFILE` when `--macos-notarize` is passed

Windows environment:

- `AVRAI_WINDOWS_CERT_SHA1`
- `AVRAI_WINDOWS_SIGNTOOL_PATH` when `signtool.exe` is not on PATH

Linux environment:

- `AVRAI_LINUX_GPG_KEY`

The GitHub workflow imports platform credentials from repository secrets only
for manual signed releases. Normal PR builds stay unsigned and must not be used
for production distribution.

The generated service templates expect a launch export JSON created by the
Business App and a callback URL for `business-node-agent-callback`.
