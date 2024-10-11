@allowed(['prod', 'test'])
param environmentType string = 'test'

var resourceGroupId = uniqueString(resourceGroup().id)
var envPrefix = environmentType == 'prod' ? 'p' : 't'
var cosmosAccountName = '${envPrefix}ca0${resourceGroupId}'
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

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2024-05-15' = {
  name: cosmosAccountName
  location: resourceGroup().location
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    publicNetworkAccess: 'Enabled'
    minimalTlsVersion: 'Tls12'
    capabilities: [
      {
        name: 'EnableServerless'
      }
    ]
    backupPolicy: {
      type: 'Periodic'
      periodicModeProperties: {
        backupIntervalInMinutes: 240
        backupRetentionIntervalInHours: 8
        backupStorageRedundancy: 'Local'
      }
    }
    locations: [
      {
        locationName: 'Switzerland North'
        failoverPriority: 0
        isZoneRedundant: true
      }
    ]
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
