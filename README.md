# Homelab Dashboard

A self-hosted, interactive topology map for visualising your homelab infrastructure. 
Built with React, React Flow, and served via Nginx in a single Docker container.

---

## Features

- Interactive node graph with drag-and-drop layout
- Node types: Proxmox, VM, LXC, Bare Metal, Network Device, Storage
- Click any node to edit its properties
- Draw connections between nodes by dragging handles
- Topology auto-saved to browser localStorage
- Export and import topology as JSON
- Dark terminal aesthetic

---

## Quick Start

### Docker Run
docker run -d \
  -p 8080:80 \
  --name homelab-dashboard \
  --restart unless-stopped \
  maxbleakley/homelab-dashboard:latest

## Docker Compose

Create a `docker-compose.yml` file with the following contents:
```yaml
services:
  homelab-dashboard:
    image: maxbleakley/homelab-dashboard:latest
    container_name: homelab-dashboard
    restart: unless-stopped
    ports:
      - "8080:80"
```

Then run:
```bash
docker compose up -d
```

Access the dashboard at `http://localhost:8080` or `http://<your-host-ip>:8080`.

To update to the latest version:
```bash
docker compose pull
docker compose up -d
```

---

## Usage

- Add nodes using the toolbar buttons at the top
- Click a node to open the properties panel and edit details
- Drag from the handles (dots on node edges) to connect nodes
- Select an edge and press Delete to remove it
- Export your topology to JSON for backup or version control
- Import a previously exported JSON to restore a topology
- NOTE: The topology that loads on first deployment is an example topology

---

## Development

Clone the repository:

git clone https://github.com/maxbleakley/homelab-dashboard
cd homelab-dashboard

Install dependencies:

npm install

Run the development server:

npm run dev

The dashboard will be available at:
http://localhost:5173

---

## Node Types

| Type           | Use Case                        |
|----------------|---------------------------------|
| Proxmox Host   | Proxmox VE hypervisor           |
| Virtual Machine| QEMU/KVM VM                     |
| LXC Container  | Linux container                 |
| Bare Metal     | Physical host or workstation    |
| Network Device | Router, switch, or access point |
| Storage        | NAS, TrueNAS, or storage array  |

---

## Roadmap

- Proxmox API integration for live VM/LXC data
- CPU, RAM, and uptime monitoring per node
- Multiple saved topology pages
- Dark/light theme toggle

---
