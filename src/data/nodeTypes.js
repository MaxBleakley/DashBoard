// This is for defining each node i.e. proxmox is given the orange colour, the label of host, the icon
// associated with it, a descrption, given the rule of if it can have children (true) and what type
// of children it can have. In this case, vm or an lxc container.

export const NODE_TYPES = {
  proxmox: {
    label: 'Proxmox Host',
    color: '#fb923c',
    glow: 'rgba(251, 146, 60, 0.2)',
    icon: 'server',
    description: 'Proxmox VE hypervisor node',
    canHaveChildren: true,
    childTypes: ['vm', 'lxc'],
  },
  vm: {
    label: 'Virtual Machine',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.2)',
    icon: 'monitor',
    description: 'QEMU/KVM virtual machine',
    canHaveChildren: false,
    parentType: 'proxmox',
  },
  lxc: {
    label: 'LXC Container',
    color: '#4ade80',
    glow: 'rgba(74, 222, 128, 0.2)',
    icon: 'box',
    description: 'Linux container (LXC)',
    canHaveChildren: false,
    parentType: 'proxmox',
  },
  baremetal: {
    label: 'Bare Metal Host',
    color: '#a78bfa',
    glow: 'rgba(167, 139, 250, 0.2)',
    icon: 'cpu',
    description: 'Physical server or workstation',
    canHaveChildren: false,
  },
  network: {
    label: 'Network Device',
    color: '#22d3ee',
    glow: 'rgba(34, 211, 238, 0.2)',
    icon: 'network',
    description: 'Router, switch, or access point',
    canHaveChildren: false,
    subtypes: ['router', 'switch', 'ap'],
  },
  storage: {
    label: 'Storage',
    color: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.2)',
    icon: 'hard-drive',
    description: 'NAS, TrueNAS, or storage array',
    canHaveChildren: false,
  },
}

export const NETWORK_SUBTYPES = {
  router: { label: 'Router' },
  switch: { label: 'Switch' },
  ap: { label: 'Access Point' },
}

export const NODE_FIELDS = {
  proxmox:   ['hostname', 'ip', 'cores', 'ram', 'notes'],
  vm:        ['name', 'vmid', 'ip', 'os', 'cores', 'ram', 'notes'],
  lxc:       ['name', 'ctid', 'ip', 'os', 'notes'],
  baremetal: ['hostname', 'ip', 'os', 'cpu', 'ram', 'notes'],
  network:   ['hostname', 'ip', 'model', 'subtype', 'vlan', 'notes'],
  storage:   ['hostname', 'ip', 'os', 'capacity', 'raidtype', 'notes'],
}

export const FIELD_LABELS = {
  hostname: 'Hostname',
  name:     'Name',
  ip:       'IP Address',
  cores:    'CPU Cores',
  ram:      'RAM (GB)',
  vmid:     'VM ID',
  ctid:     'CT ID',
  os:       'Operating System',
  cpu:      'CPU Model',
  model:    'Device Model',
  subtype:  'Device Type',
  vlan:     'VLAN',
  capacity: 'Capacity',
  raidtype: 'RAID Type',
  notes:    'Notes',
}