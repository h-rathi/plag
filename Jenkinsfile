pipeline {
    agent any

    environment {
        BACKEND_DIR = 'backend'
        FRONTEND_DIR = 'frontend'
    }

    stages {
        stage('Install Backend Dependencies') {
            steps {
                dir("${BACKEND_DIR}") {
                    bat 'npm install'
                }
            }
        }

        stage('Install Frontend & Build') {
            steps {
                dir("${FRONTEND_DIR}") {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Copy Frontend Build to Server') {
            steps {
                bat "if exist ${BACKEND_DIR}\\build rmdir /s /q ${BACKEND_DIR}\\build"
                bat "xcopy /E /I ${FRONTEND_DIR}\\build ${BACKEND_DIR}\\build"
            }
        }

        stage('Restart Server') {
            steps {
                dir("${BACKEND_DIR}") {
                    bat 'pm2 restart all || pm2 start server.js --name plagshield'
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