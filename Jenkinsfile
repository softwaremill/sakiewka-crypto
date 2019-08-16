@Library(['sml-common', 'sakiewka-jenkins-library']) _

podFactory.withNode10 {
    podFactory.withSakiewkaSettings {
        timeout(30) {
            node(POD_LABEL) {
                stage('Checkout') {
                    checkout scm
                    gitCommitHash = git.getShortCommitHash()
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
}