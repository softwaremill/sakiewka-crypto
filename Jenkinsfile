#!/usr/bin/env groovy

@Library('sml-common')

String getGitCommitHash() {
    return sh(script: 'git rev-parse HEAD', returnStdout: true)?.trim()
}

def serviceAccount = "jenkins"
podFactory.withNode10 {
    podFactory.withServiceAccount(serviceAccount) {
        node(POD_LABEL) {
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
}