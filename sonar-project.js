const scanner = require('sonarqube-scanner').default;

scanner(
	{
		serverUrl: 'https://sqube.v3il.xyz',
		token: 'squ_d71d65d189f3a4f83516d6733cbc374c6d0a454c',
		options: {
			'sonar.projectName': 'CICD-Api',
			'sonar.projectDescription': 'Description',
			'sonar.sources': 'src',
			// 'sonar.tests': 'test',
		},
	},
	error => {
		if (error) {
			console.error(error);
		}
		process.exit();
	},
)
