/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { reactive } from 'vue';

import { InventoryItem } from 'src/interfaces/IInventoryItem';

import { readRowsFromTable } from 'src/api/supabase';
import { productCatalogToInventoryItem } from 'src/api/helpers';

let productInventory: InventoryItem[] = reactive([]);

const useProductInventory = () => {
  const fetchProductCatalog = async () => {
    const productCatalog = await readRowsFromTable('product_catalog');

    productInventory = productCatalog.map((product: any) =>
      productCatalogToInventoryItem(product)
    );
  };

  return {
    productInventory,
    fetchProductCatalog,
  };
};

export default useProductInventory;
