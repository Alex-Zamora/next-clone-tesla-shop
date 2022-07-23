import { Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";

const WomenPage = () => {

  const { products, isLoading } = useProducts(`/products?gender=women`);

  return (
    <ShopLayout title={"Tesla Shop - Women"} pageDescription={'Encuentra los mejores productos de Tesla'}>
    <Typography variant="h1" component="h1">Women</Typography>
    <Typography variant="h2" sx={{ mb: 1 }}>Todos los productos</Typography>

    {
      isLoading
        ? <FullScreenLoading />
        : <ProductList products={ products } />
    }

  </ShopLayout>
  )
}

export default WomenPage;