pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from the Git repository
                git 'https://github.com/your-repo.git'
            }
        }
        
        stage('Push to Dev Environment') {
            steps {
                // Here you can add commands to push changes to your dev environment
                // For example, if your dev environment is configured as a remote Git repository:
                sh 'git push dev-remote master'
                
                // Or any other deployment command suitable for your environment
                // For example, deploying to a server using SSH:
                // sh 'ssh user@dev-server "cd /path/to/deployment && git pull"'
            }
        }
    }
    
    post {
        always {
            // Clean up steps if needed
        }
    }
}
