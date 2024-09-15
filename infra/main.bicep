@allowed(['prod', 'test'])
param environmentType string = 'test'

var resourceGroupId = uniqueString(resourceGroup().id)
var envPrefix = environmentType == 'prod' ? 'p' : 't'
var storageAccountName = '${envPrefix}sa0${resourceGroupId}'
var appServicePlanName = 'plan4wlsp'
var apiServiceAppName = '${envPrefix}api0${resourceGroupId}'
var appServiceAppName = '${envPrefix}as0${resourceGroupId}'

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: resourceGroup().location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: appServicePlanName
  location: resourceGroup().location
  sku: {
    name: 'F1'
    capacity: 1
  }
}

resource appServiceApp 'Microsoft.Web/sites@2023-12-01' = {
  name: appServiceAppName
  location: resourceGroup().location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      ftpsState: 'Disabled'
      detailedErrorLoggingEnabled: environmentType == 'prod' ? false : true
      appSettings: [
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~22'
        }
      ]
    }
  }

  resource authSettings 'config' = {
    name: 'authsettingsV2'
    kind: 'string'
    properties: {
      globalValidation: {
        requireAuthentication: false
        unauthenticatedClientAction: 'RedirectToLoginPage'
      }
      identityProviders: {
        azureActiveDirectory: {
          enabled: false
        }
      }
    }
  }
}

resource apiServiceApp 'Microsoft.Web/sites@2023-12-01' = {
  name: apiServiceAppName
  location: resourceGroup().location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      ftpsState: 'Disabled'
    }
  }
}
