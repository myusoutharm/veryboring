# SwiftOps Suite: Restaurant IT Operations Toolkit

The SwiftOps Suite is a collection of specialized, "fire-and-forget" IT operations tools designed specifically for the hospitality and retail sectors. The suite empowers IT departments to delegate low-level remediation tasks to on-site staff safely, while maintaining centralized governance and high-security standards.

---

## 1. IT Ops Portal (Service Orchestration)
**What it is:** A web-based gateway for managing Windows services and scheduled tasks on remote POS servers.
*   **Value Proposition:** Secure, remote service management without direct server access.
*   **Pain Points Resolved:** POS "freezes" or payment gateway service crashes that require manual RDP sessions or IT intervention to restart.
*   **Why IT Loves It:**
    *   **Zero Administrative Access:** Users can restart specific services without having server credentials or RDP access.
    *   **SSH-to-Task-Scheduler Bridge:** Uses a robust mechanism to ensure services restart in a clean console session.
    *   **Auditability:** Every restart is logged with the user's email identity.

## 2. ScreenBumper (KDS Automation)
**What it is:** An automation tool for clearing stuck or incorrect transactions from ConnectSmart Kitchen Display Systems (KDS).
*   **Value Proposition:** Restores kitchen flow instantly by removing "ghost" orders or stuck tickets.
*   **Pain Points Resolved:** Orders that won't "bump" from the screen, cluttering the kitchen workflow and causing operational delays during peak hours.
*   **Why IT Loves It:**
    *   **Reduced Support Tickets:** Operations staff can clear their own screens via a simple UI instead of calling the helpdesk.
    *   **API-Driven:** Can be integrated into larger automation scripts or POS workflows.
    *   **Intelligent Logic:** Automatically handles mixed tendered/non-tendered statuses to prevent accidental removal of active orders.

## 3. MDM Reboot (Mobile Fleet Management)
**What it is:** A Cisco Meraki API integration for managing and rebooting supervised iOS devices (iPads).
*   **Value Proposition:** One-click hardware reboots for remote mobile devices.
*   **Pain Points Resolved:** iPads that become unresponsive, lose network connectivity, or have frozen apps that cannot be fixed via software-only restarts.
*   **Why IT Loves It:**
    *   **API Consolidation:** No need to give on-site managers access to the Meraki Dashboard.
    *   **Serial Management:** Automatically maps location-based device names to hardware serial numbers via CSV/API sync.
    *   **Vendor Agnostic Architecture:** Designed to eventually support other MDM providers (Jamf, AirWatch) beyond Meraki.

## 4. VM Reboot (Virtualization Management)
**What it is:** A remote control tool for VMware Workstation Pro virtual machines running at the edge.
*   **Value Proposition:** Granular power-cycling of individual VMs without hypervisor access.
*   **Pain Points Resolved:** Failed edge VMs (e.g., local controllers or database mirrors) that require a hard reset but are running on hosts without accessible remote management consoles.
*   **Why IT Loves It:**
    *   **SSH Command Bridging:** Uses `vmrun` over SSH to execute clean resets.
    *   **Edge Reliability:** Critical for "Store-in-a-Box" setups where local virtualization is the backbone of the site.
    *   **Safety:** Restricts users to specific VMs defined in the configuration, preventing accidental resets of host machines.

---

## Why This Makes the IT Team's Life Easier

The SwiftOps Suite isn't just about operations; it's about giving the IT team their time and sanity back.

### **1. Eliminate the "Simple Fix" Escalation**
Stop being interrupted by "Can you restart the credit card service?" or "A ticket is stuck on the KDS." By delegating these safe, predefined actions to on-site managers, you eliminate 60% of low-level support tickets and late-night RDP calls.

### **2. No RDP, No VPN, No Friction**
Accessing a remote restaurant server typically involves multiple layers of VPNs and RDP sessions. SwiftOps turns a 5-minute connection ordeal into a 5-second click. It works over standard SSH/HTTPS, meaning you don't need to punch holes in your security perimeter or manage remote desktop licenses.

### **3. Centralized Sanity & No More "Who Did That?"**
Troubleshooting is easier when the data is in one place. Instead of checking Meraki logs, Windows Event Viewer, and VMware logs separately, the SwiftOps Audit Log gives you a single, unified timeline of every remediation attempt across the entire fleet.

### **4. "Fire-and-Forget" Peace of Mind**
Restaurant internet is notoriously flaky. Our backend architecture handles the heavy lifting. Once you or a manager clicks "Execute," the suite manages the connection and execution to completion. You don't have to stay on the line to see if the command actually reached the server.

### **5. Zero Credential Management**
Tired of managing "Manager Passwords" for 50 different locations? SwiftOps integrates with your existing Cloudflare SSO. You control access via email groups you already manage. One login for them, zero password-reset tickets for you.

---
*SwiftOps Suite — a product of [Very Boring Technologies](https://veryboring.ai)*
