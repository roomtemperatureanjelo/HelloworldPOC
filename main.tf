provider "azurerm" {
  features {}
  subscription_id = "55250548-0940-48b7-8b85-ff47e70395f7"
}

resource "azurerm_resource_group" "rg" {
  name     = "Rg_nodejs"
  location = "Japan West"
}

resource "azurerm_kubernetes_cluster" "aks" {
  name                = "aks-cluster"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "aks-cluster-dns"  # Makes public cluster

  default_node_pool {
    name       = "default"
    node_count = 3
    vm_size    = "Standard_DS2_v2"
  }

  identity {
    type = "SystemAssigned"
  }
}

output "kube_config" {
  sensitive = true
  value = azurerm_kubernetes_cluster.aks.kube_config_raw
}

