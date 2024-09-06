// @allowed(['prod', 'test'])
// param environmentType string = 'test'

var storageAccountName = 'stacc4wlsp0${uniqueString(resourceGroup().id)}'
var appServicePlanName = 'plan4wlsp'
var appServiceAppName = 'app4wlsp0${uniqueString(resourceGroup().id)}'

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
  }
}
