#!/usr/bin/env groovy

String getGitCommitHash() {
    return sh(script: 'git rev-parse HEAD', returnStdout: true)?.trim()
}

def label = "node10-${UUID.randomUUID().toString()}"
def serviceAccount = "icouhouse-jenkins"
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
        container('node10') {
            stage('Execute test') {
                sh """
                set -e
                npm install
                npm test
                """
            }
        }
    }
}