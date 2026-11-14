# ClearFiling — Client-Owned Infrastructure & Onboarding Guide
**Governance, Security Protocol & Setup Instructions for Production Infrastructure**  
**Repository:** `/Users/ritweek/Desktop/Clearfiling/ClearFiling`  
**Target Domain:** `https://www.clearfiling.co.in/`  
**Date:** 2026-11-10  
**Status:** MANDATORY GOVERNANCE PROTOCOL

---

## 1. Core Ownership Principles

To guarantee business continuity, legal compliance, and total institutional control, **all production infrastructure, databases, third-party storage, and hosting accounts must be created and owned by ClearFiling using an official business email address.**

### Strict Governance Rules
1. **Organization Owner:** The client's designated administrator must hold the primary Owner/Super Admin role on every platform.
2. **Billing & Recovery:** Billing details, credit cards, billing alerts, and account recovery phone numbers must belong strictly to ClearFiling.
3. **No Developer Personal Accounts:** Production databases and services must **never** be provisioned using a developer's personal email or personal credit card.
4. **Delegated Least-Privilege Access:** Developers must be granted access solely via delegated invitations (team member / project contributor roles) with minimum necessary permissions.
5. **Zero Credential Exposure:** Production secrets, database URIs, API keys, and JWT secrets must never be committed to Git repositories or exposed in client bundles.

---

## 2. Infrastructure Ownership Matrix

| Service | Client Role | Developer Access Level | Official Email to Use |
| :--- | :--- | :--- | :--- |
| **MongoDB Atlas** | Organization Owner & Billing Admin | Project Data Access / Project Member | Official business email |
| **Cloudinary (PDF Storage)** | Master Account Owner | Technical / Media Manager | Official business email |
| **Backend Host (Render/Railway/VM)** | Account Owner | Collaborator / Deployer | Official business email |
| **Vercel (Admin & Public Frontend)** | Team Owner | Member / Developer | Official business email |
| **Domain Registrar / DNS** | Sole Administrator | No direct access needed (records delegated) | Official business email |

---

## 3. Step-by-Step MongoDB Atlas Setup Guide (For Client)

The client should follow these steps to provision the production database. This takes approximately **10–15 minutes**.

### Step 1: Account Creation
1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register).
2. Register using your official business email (e.g., `admin@clearfiling.co.in` or primary corporate Google Workspace email).
3. Verify your email address and enable Two-Factor Authentication (2FA) under Account Settings.

### Step 2: Create Organization & Project
1. **Organization Name:** `ClearFiling`
2. **Project Name:** `ClearFiling-Production`

### Step 3: Deploy a Database Cluster
1. Choose **Create a Deployment**.
2. **Tier Selection:**
   - For Initial Launch: **M0 Free Shared Tier** (or **M10 Dedicated** for immediate automated backups and high throughput).
3. **Cloud Provider & Region:**
   - **Provider:** AWS (or Google Cloud).
   - **Region:** `ap-south-1` (Mumbai, India) for minimal latency and data residency compliance.
4. **Cluster Name:** `clearfiling-cluster-prod`
5. Click **Create Deployment**.

### Step 4: Configure Database User (Least Privilege)
1. Navigate to **Security &rarr; Database Access** &rarr; **Add New Database User**.
2. **Authentication Method:** Password.
3. **Username:** `clearfiling_api_prod`
4. **Password:** Generate a secure 24+ character password (save in a secure password manager).
5. **Database User Privileges:**
   - Select **Built-in Role** &rarr; `Read and write to any database` (or restrict specifically to the `clearfiling` database).
6. Click **Add User**.

### Step 5: Configure Network Access (IP Whitelist)
1. Navigate to **Security &rarr; Network Access** &rarr; **Add IP Address**.
2. **Option A (If Backend Host IP is known):** Add the static outbound IP of your backend server with a description (e.g. `Render Backend`).
3. **Option B (Serverless / Dynamic IP Hosting):**
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`).
   - *Note:* Security is maintained by your strong, unique database user password and TLS/SSL encryption.
4. Click **Confirm**.

### Step 6: Delegate Developer Access
1. Navigate to **Project Settings &rarr; Access Manager** &rarr; **Project Users** &rarr; **Invite to Project**.
2. Enter the developer's email address.
3. Assign the role: **Project Data Access Read/Write** (or **Project Member**).
4. Click **Send Invite**.
5. *Do NOT grant Organization Owner or Billing Admin to external developers.*

### Step 7: Retrieve Connection String
1. In the Atlas dashboard, click **Connect** on your cluster.
2. Select **Drivers** (Node.js).
3. Copy the standard connection string template:
   ```text
   mongodb+srv://clearfiling_api_prod:<password>@clearfiling-cluster-prod.xxxxx.mongodb.net/clearfiling?retryWrites=true&w=majority
   ```
4. Replace `<password>` with the actual database user password.
5. Provide this URI via an encrypted channel (see Section 6).

---

## 4. Step-by-Step Cloudinary Setup Guide (For Client)

Cloudinary provides the initial secure storage and fast CDN delivery for ClearFiling's corporate PDF documents.

### Step 1: Account Creation
1. Go to [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free).
2. Register using your official business email.
3. Confirm email verification and log in.

### Step 2: Retrieve API Credentials
1. In the Cloudinary Dashboard, locate the **Product Environment Credentials**:
   - **Cloud Name:** (e.g., `clearfiling-media`)
   - **API Key:** (e.g., `123456789012345`)
   - **API Secret:** (Click to reveal)
2. Store these credentials securely.

### Step 3: Security & Storage Settings
1. Navigate to **Settings &rarr; Security**:
   - Ensure **Strict transformations** is enabled.
   - Restrict allowed upload types if desired (the API enforces server-side magic-byte validation).
2. Navigate to **Settings &rarr; Upload**:
   - Confirm upload presets or folder naming policies.

### Step 4: Delegate Access
1. Navigate to **Settings &rarr; Users / Team**.
2. Invite the developer as a **Technical User** or **Media Manager** so they can inspect logs without having account ownership.

---

## 5. Development vs. Production Isolation Strategy

To ensure zero risk to production data while accounts are being provisioned, development and testing will strictly adhere to the following isolation boundaries:

```text
┌────────────────────────────────────────────────────────┐
│                   Development Phase                    │
│                                                        │
│  • Local MongoDB / Local Test URI                      │
│    mongodb://127.0.0.1:27017/clearfiling_dev           │
│  • Local Mock / Staging Storage                        │
│  • Zero Production Access Required                     │
└────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                Production Provisioning                 │
│                                                        │
│  • Client provisions official MongoDB Atlas & Cloudinary│
│  • Client delegates access to Developer Account        │
│  • Secrets populated in Backend Hosting Environment    │
│  • Production Smoke Test Executed                      │
└────────────────────────────────────────────────────────┘
```

### Local Test Configuration (`server/.env.local` / `dev`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/clearfiling_dev
JWT_SECRET=REPLACE_WITH_A_SECURE_RANDOM_SECRET
CLIENT_ORIGIN=http://localhost:5173
ADMIN_ORIGIN=http://localhost:5174
```

---

## 6. Secure Handover Protocol

Production secrets must never be transmitted via email, unencrypted Slack/WhatsApp, or committed to code.

### Approved Secure Channels
1. **Password Manager Secure Share:** (1Password, Bitwarden Send, or Dashlane).
2. **Encrypted One-Time Secret Link:** (e.g., Privnote or OneTimeSecret with passphrase).
3. **Direct Entry by Client:** Client directly inputs the secrets into the hosting provider's Environment Variables dashboard (e.g. Render / Railway / Vercel settings), meaning the developer never handles the raw production password directly.

---

## 7. Client Onboarding Action Checklist

Please complete the following checklist when ready to configure production services:

- [ ] **MongoDB Atlas Account Created:** Registered with official business email.
- [ ] **2FA Enabled:** Two-factor authentication active on client MongoDB account.
- [ ] **Database Cluster Deployed:** Region set to `ap-south-1` (Mumbai).
- [ ] **Database User Created:** User `clearfiling_api_prod` with strong 24+ char password.
- [ ] **Network Access Allowed:** IP whitelist or `0.0.0.0/0` configured.
- [ ] **Developer Invited:** Developer account invited with Project Member / Data Access role.
- [ ] **Cloudinary Account Created:** Registered with official business email.
- [ ] **Cloudinary Credentials Copied:** Cloud Name, API Key, and Secret securely noted.
- [ ] **Production Secrets Ready:** Prepared for direct entry into the hosting environment.

---

*This guide ensures full institutional control and regulatory data hygiene for ClearFiling.*

