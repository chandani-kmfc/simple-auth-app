pipeline {
    agent any

    environment {
        IMAGE_NAME = "simple-auth-app"
        CONTAINER_NAME = "simple-auth-app"
        PORT = "4000"
        GIT_REPO = "https://github.com/chandani-kmfc/simple-auth-app.git"
        GIT_BRANCH = "main"
    }

    options {
        // Keep only last 10 builds
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // Timeout in case pipeline hangs
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Checkout') {
            steps {
                echo "📥 Cloning Git repository..."
                git branch: "${GIT_BRANCH}", url: "${GIT_REPO}"
            }
        }

        stage('Stop Existing Container') {
            steps {
                echo "🛑 Stopping any running container..."
                sh """
                if [ \$(docker ps -q -f name=${CONTAINER_NAME}) ]; then
                    docker stop ${CONTAINER_NAME}
                    docker rm ${CONTAINER_NAME}
                fi
                """
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image..."
                sh """
                docker build -t ${IMAGE_NAME} .
                """
            }
        }

        stage('Run Docker Container') {
            steps {
                echo "▶️ Running Docker container..."
                sh """
                docker run -d -p ${PORT}:${PORT} --name ${CONTAINER_NAME} ${IMAGE_NAME}
                """
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully. App running at http://localhost:${PORT}"
        }
        failure {
            echo "❌ Pipeline failed. Check Jenkins logs!"
        }
    }
}
