#!/usr/bin/env groovy

String getGitCommitHash() {
    return sh(script: 'git rev-parse HEAD', returnStdout: true)?.trim()
}

def label = "node8-${UUID.randomUUID().toString()}"
def serviceAccount = "icouhouse-jenkins"
podTemplate(label: label, yaml: """
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: ${serviceAccount}
  containers:
  - name: node8
    image: node:8
    securityContext: 
        privileged: true
        runAsUser: 0
"""
) {
    node(label) {
        stage('Checkout') {
            checkout scm
            gitCommitHash = getGitCommitHash()
        }
        container('node8') {
            stage('Execute test') {
                sh """
                set -e
                npm test
                """
            }
        }
    }
}