import  { useEffect, useState } from 'react';
import {Col, Row, Typography} from 'antd';
import { Method } from 'axios';
import { Content } from 'antd/es/layout/layout';
import { PiSealWarningThin } from 'react-icons/pi';
import { dbService } from '../../service/axios.service';
import ProductCard from '../../components/productCard';

const Shopping = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<string | "">("");

    const getProducts = async() => {
        try 
        {
            setLoading(true);

            const result = await dbService (`/get-products?search=${filter}`, 'get' as Method);

            setProducts(result?.data?.data || []);
        } 
        catch (error: any) 
        {
            setProducts([]);
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        getProducts();
    },[]);

  return (
    <Row gutter={[24,24]}>
        {
            products?.length > 0 ? products.map((item: any, index: number) => (
                <Col xs={24} sm={12} md={8} lg={6} key={`item-${index}`}>
                    <ProductCard key={`item-${index}`} item={item}/>
                </Col>
            ))
            :
            <Col span={24}>
                <Content className='flex flex-col justify-center items-center gap-3 w-full !min-h-[50vh] opacity-30'>
                    <PiSealWarningThin size={60} />
                    <Typography.Title level={2}>ບໍ່ມີລາຍການສິນຄ້າ!</Typography.Title>
                </Content>
            </Col>
        }
    </Row>
  )
}

export default Shopping