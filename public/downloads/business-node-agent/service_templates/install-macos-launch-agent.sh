#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 3 ]; then
  echo "Usage: install-macos-launch-agent.sh <agent-path> <launch-export-json> <callback-url>" >&2
  exit 64
fi

agent_path="$1"
launch_export_path="$2"
callback_url="$3"
label="com.avrai.business-node-agent"
install_dir="$HOME/Library/Application Support/AVRAI/BusinessNodeAgent"
logs_dir="$HOME/Library/Logs/AVRAI"
plist_dir="$HOME/Library/LaunchAgents"
plist_path="$plist_dir/$label.plist"
template_dir="$(cd "$(dirname "$0")" && pwd)"
template_path="$template_dir/com.avrai.business-node-agent.plist"

mkdir -p "$install_dir" "$logs_dir" "$plist_dir"
cp "$agent_path" "$install_dir/avrai-business-node-agent"
chmod 755 "$install_dir/avrai-business-node-agent"
cp "$launch_export_path" "$install_dir/launch-export.json"

escape_xml() {
  sed -e 's/&/\&amp;/g' -e 's/</\&lt;/g' -e 's/>/\&gt;/g' -e 's/"/\&quot;/g'
}

agent_xml="$(printf '%s' "$install_dir/avrai-business-node-agent" | escape_xml)"
launch_xml="$(printf '%s' "$install_dir/launch-export.json" | escape_xml)"
callback_xml="$(printf '%s' "$callback_url" | escape_xml)"
state_xml="$(printf '%s' "$install_dir/node-state.json" | escape_xml)"
logs_xml="$(printf '%s' "$logs_dir" | escape_xml)"

sed \
  -e "s|__AVRAI_BUSINESS_NODE_AGENT_PATH__|$agent_xml|g" \
  -e "s|__AVRAI_BUSINESS_NODE_LAUNCH_EXPORT__|$launch_xml|g" \
  -e "s|__AVRAI_BUSINESS_NODE_CALLBACK_URL__|$callback_xml|g" \
  -e "s|__AVRAI_BUSINESS_NODE_STATE_PATH__|$state_xml|g" \
  -e "s|__AVRAI_BUSINESS_NODE_LOG_DIR__|$logs_xml|g" \
  "$template_path" > "$plist_path"

launchctl bootout "gui/$(id -u)" "$plist_path" >/dev/null 2>&1 || true
launchctl bootstrap "gui/$(id -u)" "$plist_path"
launchctl enable "gui/$(id -u)/$label"

echo "Installed AVRAI Business Node Agent LaunchAgent: $plist_path"
