@Library(['sml-common', 'sakiewka-jenkins-library']) _

podFactory.withNode10 {
    podFactory.withSakiewkaSettings {
        timeout(30) {
            node(POD_LABEL) {
                stage('Checkout') {
                    checkout scm
                    gitCommitHash = git.getShortCommitHash()
                }
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
            }
        }
    }
}