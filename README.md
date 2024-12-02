# CICD-Api

![Diagram](https://i.postimg.cc/BbhVC1yK/cicd-min.jpg)

This repository holds the Application source code

- Code changes are committed to the **[Application Git repository](https://github.com/m0dularm1nd/CICD-Api)**, triggering the next steps via a webhook.
- Jenkins first pipeline pulls code from the Git repository, building the application, and pushing the new artifact to the private Nexus repository, then a second pipeline updates new image tags and version.
- ArgoCD manages continuous delivery by syncing with the argo branch to the 1st cluster.
- FluxCD source controller syncing flux branch to 2nd cluster.
- Hashi Corp Vault is deployed to seal Nexus credentials secrets using (vault secrets operator).
- Keycloak Provides GUI (Single Sign-On) using OpenID Connect (OIDC) for jenkins, argo, and grafana.
- [Live Demo here](https://api.v3il.xyz)
