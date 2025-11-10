pipeline {
    agent any

    environment {
        IMAGE_NAME = "simple-auth-app"
        CONTAINER_NAME = "simple-auth-app"
        PORT = "4000"
        GIT_REPO = "https://github.com/chandani-kmfc/simple-auth-app.git"
        GIT_BRANCH = "main"
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo "Cloning Git repository..."
                git branch: "${GIT_BRANCH}", url: "${GIT_REPO}"
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Stop Existing Container') {
            steps {
                echo "Stopping any running container..."
                sh "docker stop ${CONTAINER_NAME} || true"
                sh "docker rm ${CONTAINER_NAME} || true"
                sh "docker rmi ${IMAGE_NAME} || true"
            }
        }

        stage('Run Docker Container') {
            steps {
                echo "Running Docker container..."
                sh "docker run -d -p ${PORT}:${PORT} --name ${CONTAINER_NAME} ${IMAGE_NAME}"
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully. App running at http://localhost:${PORT}"
        }
        failure {
            echo "❌ Pipeline failed. Check logs!"
        }
    }
}
