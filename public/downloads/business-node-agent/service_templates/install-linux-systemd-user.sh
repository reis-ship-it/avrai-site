#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 3 ]; then
  echo "Usage: install-linux-systemd-user.sh <agent-path> <launch-export-json> <callback-url>" >&2
  exit 64
fi

agent_path="$1"
launch_export_path="$2"
callback_url="$3"
install_dir="$HOME/.local/share/avrai/business-node-agent"
unit_dir="$HOME/.config/systemd/user"
unit_path="$unit_dir/avrai-business-node-agent.service"

mkdir -p "$install_dir" "$unit_dir"
cp "$agent_path" "$install_dir/avrai-business-node-agent"
chmod 755 "$install_dir/avrai-business-node-agent"
cp "$launch_export_path" "$install_dir/launch-export.json"

cat > "$unit_path" <<UNIT
[Unit]
Description=AVRAI Business Node Agent
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=$install_dir/avrai-business-node-agent --launch-export $install_dir/launch-export.json --callback-url $callback_url --service --state-path $install_dir/node-state.json --heartbeat-interval 60
Restart=always
RestartSec=60
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=default.target
UNIT

systemctl --user daemon-reload
systemctl --user enable --now avrai-business-node-agent.service

echo "Installed AVRAI Business Node Agent systemd user service: $unit_path"
