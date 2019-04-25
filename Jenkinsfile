// Pipeline
pipeline {
    // Agent
    agent any
    tools {nodejs "node"}
    // Custom ENV
    environment {
      // Branch mapping
      BRANCH_MAPPING = sh (
        script: "./aluxion/branch-mapping.sh ${env.BRANCH_NAME}",
        returnStdout: true
      ).trim()
      // Version
      IMAGE_VERSION = sh (
        script: "./aluxion/version.sh",
        returnStdout: true
      ).trim()
    }
    // Define stages
    stages {
      stage("TEST / LINTER") {
        steps {
          sh 'npm i --unsafe-perm=true'
          sh 'npm run lint'
        }
      }
      // Build docker image
      stage("BUILD/PUSH") {
        // Condition
        when {
          expression {
            return env.BRANCH_NAME == "master"
          }
        }
        steps {
          // Notification
          slackSend (color: "#FFFF00", message: "STARTED: Job ${env.JOB_NAME} [${env.BUILD_NUMBER}] (${env.BUILD_URL})")
          // Custom script
          script {
            // Trycatch
            try {
              // Build image
              def app = docker.build("${env.FILE_SERVICE_REPO}:${env.BRANCH_MAPPING}")
              // Aws login
              sh '$(aws ecr get-login --no-include-email)'
              // Push
              app.push()
              // Finish
              currentBuild.result = "SUCCESS"
            } catch (Exception error) {
              // Error handler
              slackSend (color: "#C0392B", message: "FAILED: Job ${env.JOB_NAME} [${env.BUILD_NUMBER}]: ${env.BUILD_URL}console")
              // Finish
              currentBuild.result = "FAILURE"
              // Exit
              throw error
            }
          }
        }
      }
      // Deploy
      stage("DEPLOY") {
        steps {
          // Custom script
          script {
            // Validate
            if (currentBuild.result != "SUCCESS") {
              return
            }
            try {
              // Deploy
              sh "aws ecs update-service --cluster ${env.ALUXION_CLUSTER} --service ${env.FILE_SERVICE_ARN} --region ${env.AWS_REGION} --force-new-deployment"
              // Notification
              slackSend (color: "#196F3D", message: "FINISHED: Job ${env.JOB_NAME} [${env.BUILD_NUMBER}]")
            } catch (Exception error) {
              // Error handler
              slackSend (color: "#C0392B", message: "FAILED: Job ${env.JOB_NAME} [${env.BUILD_NUMBER}]: ${env.BUILD_URL}console")
              // Exit
              throw error
            }
          }
        }
      }
    }
}
