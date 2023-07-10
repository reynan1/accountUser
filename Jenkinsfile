pipeline {
  agent {
    node {
      label 'KYOO_DEVE01'
      customWorkspace '/var/www/html/BE/v4/general-kyoo/mailer-service'
    }
  }
  environment {
    DOCKER_REGISTRY = 'leisuedevteam'
    DOCKER_IMAGE_NAME = 'mailer-v4'
    DOCKER_IMAGE_TAG = 'staging'
  }
  stages {
    stage ('Building') {
      steps {
        sh '(cd ../composer-v4 && sudo docker-compose up -d --build mailer-v4)'
      }
    }
    stage ('Integration Testing') {
      steps {
        sh 'echo "Perform integration testing."'
      }
    }
    stage ('Released Build') {
      steps {
        sh 'sudo docker commit $(sudo docker ps -a -q -f name=^\${DOCKER_IMAGE_NAME}\$) ${DOCKER_REPO} ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}'
        sh 'sudo docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}'
      }
    }
  }
}
