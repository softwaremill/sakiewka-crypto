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
                    parallel(
                        'Test crypto-local': {
                            stage('Test crypto-local') {
                                build job: '../sakiewka-crypto-local/master', parameters: [string(name: 'CRYPTO_VERSION', value: gitCommitHash)]
                            }
                        },
                        'Test crypto-private': {
                            stage('Test crypto-private') {
                                build job: '../sakiewka-crypto-private/master', parameters: [string(name: 'CRYPTO_VERSION', value: gitCommitHash)]
                            }
                        }
                    )
                }
            }
        }
    }
}