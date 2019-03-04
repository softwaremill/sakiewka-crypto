#!/usr/bin/env groovy

@Library('sml-common')

String getGitCommitHash() {
    return sh(script: 'git rev-parse HEAD', returnStdout: true)?.trim()
}

def label = "node10-${UUID.randomUUID().toString()}"
def serviceAccount = "jenkins"
podTemplate(label: label, yaml: """
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: ${serviceAccount}
  containers:
  - name: node10
    image: node:10
    command:
        - cat
    tty: true
"""
) {
    node(label) {
        stage('Checkout') {
            checkout scm
            gitCommitHash = getGitCommitHash()
        }
        try{
            container('node10') {
                stage('Execute test') {
                    sh """
                    set -e
                    npm ci
                    npm run-script build
                    npm test
                    """
                }
            }
        } catch(e) {
            currentBuild.result = 'FAILED'
            throw e
        } finally  {
            slackNotify(
                buildStatus: currentBuild.currentResult,
                slackChannel: "#sakiewka",
                slackTeam: "softwaremill",
                slackTokenCredentialId: 'sml-slack-token')
        }
    }
}