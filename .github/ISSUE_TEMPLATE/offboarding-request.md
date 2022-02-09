---
name: Offboarding Request
about: Request to offboard a user from the Lighthouse tools controlled by the DevOps
  team.
title: Offboarding of full_name_of_user
labels: offboarding
assignees: ''
---

<!--
Note: This ticket is to request assistance to offboard a user from the Lighthouse tools controlled by the DevOps team. This does NOT constitute full offboarding of a user from the Lighthouse program or VA. For General Offboarding guidance, visit https://community.max.gov/display/VAExternal/General+Offboarding .
-->

## Details of the person being offboarded

- Name
  > John Smith
- E-Mail (Company)
  > johnsmith@libertyits.com
- E-Mail (VA)
  > johnsmith@va.gov
- GitHub Username
  > johnsmith-va
- User leaving the VA? (Y/N)
  > N
- Last Day
  > mm/dd/yyyy

<!--

DO NOT MODIFY BELOW THIS LINE. THESE CHECKBOXES ARE FOR THE PERSON WORKING THE TICKET, NOT THE SUBMITTER.

-->

## If the user is leaving the Lighthouse Program

- [ ] Request removal from DVP AWS Console and Jumpbox - ([Submit ticket with VAEC](https://wfm.vaec.va.gov/servicedesk/customer/portals))
  > Actual ticket: replace_with_ticket_url
- [ ] Request removal from DSVA resources (DSVA AWS, DSVA Slack, SOCKS, VSP tools, etc.) - ([Submit ticket with VSP Ops](https://github.com/department-of-veterans-affairs/va.gov-team/issues/new/choose))
  > Actual ticket: replace_with_ticket_url
- [ ] Remove from DVP DockerHub
- [ ] Remove from DVP Grafana
- [ ] Remove from DVP Jenkins
- [ ] Remove from core Lighthouse GitHub teams - ([health-api-nexus-admin](https://github.com/orgs/department-of-veterans-affairs/teams/health-api-nexus-admin), [health-api-nexus-deployer](https://github.com/orgs/department-of-veterans-affairs/teams/health-api-nexus-deployer), [lighthouse-apis](https://github.com/orgs/department-of-veterans-affairs/teams/lighthouse-apis))
- [ ] Identify Slack webhooks owned by the user(s) and create Jira story in their team's board to transition them
  > Actual ticket: replace_with_jira_story_url, or N/A if not applicable

## If the user is leaving the VA

- [ ] Request removal from VA GitHub Enterprise - ([Submit ticket with VA GitHub Org](https://github.com/department-of-veterans-affairs/github-user-requests/issues/new/choose))
  > Actual ticket: replace_with_ticket_url

## If the user is leaving Leeroy Jenkles

- [ ] Remove from DevOps team calendar invites
- [ ] Remove from DevOps team Slack channels
- [ ] Remove from DVP PagerDuty
- [ ] Remove from DVP Pingdom (rotate password and update in Param Store)
- [ ] Remove from Keybase team: leeroyjenkles
- [ ] Remove from team-specific Lighthouse GitHub teams - ([Lighthouse-Health-APIs-leeroyjenkles](https://github.com/orgs/department-of-veterans-affairs/teams/Lighthouse-Health-APIs-leeroyjenkles), [lighthouse-leeroyjenkles](https://github.com/orgs/department-of-veterans-affairs/teams/lighthouse-leeroyjenkles))
- [ ] Remove from Microsoft Teams (Company): DVP DevOps
- [ ] Remove from Microsoft Teams (VA): Lighthouse DevOps
- [ ] Remove from VA Email Distributions: Lighthouse DevOps

CC: @department-of-veterans-affairs/lighthouse-leeroyjenkles , @Kathy0767
