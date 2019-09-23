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
                    stage('Test crypto-local') {
                        build job: '../sakiewka-crypto-local/better-jenkins-test', parameters: [string(name: 'CRYPTO_VERSION', value: gitCommitHash)]
                    }
                    stage('Test crypto-private') {
                        build job: '../sakiewka-crypto-private/better-jenkins-test', parameters: [string(name: 'CRYPTO_VERSION', value: gitCommitHash)]
                    }
                }
            }
        }
    }
}