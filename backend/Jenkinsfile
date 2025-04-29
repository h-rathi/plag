pipeline {
    agent any

    environment {
        BACKEND_DIR = 'frontend'
        FRONTEND_DIR = 'backend'
    }

    stages {
        stage('Install Backend Dependencies') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh 'npm install'
                }
            }
        }

        stage('Install Frontend & Build') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Copy Frontend Build to Server') {
            steps {
                sh "rm -rf ${BACKEND_DIR}/build"
                sh "cp -r ${FRONTEND_DIR}/build ${BACKEND_DIR}/build"
            }
        }

        stage('Restart Server') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh 'pm2 restart all || pm2 start server.js --name plagshield'
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed.'
        }
    }
}
