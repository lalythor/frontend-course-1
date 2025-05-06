import { Button, Flex, Input, notification, Skeleton, Statistic, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Content } from 'antd/es/layout/layout';
import { dbService } from '../../service/axios.service';
import { Method } from 'axios';
import { PiExportLight } from 'react-icons/pi';
import dayjs from 'dayjs';
import { formatNumber } from '../../util/fileHelper';
import { downloadExcel } from '../../util/export.excel';

const SaleList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<string | "">("");

    const columns = [
        {
            title: "#",
            width: 70,
            render: (_: string,_record: any,index:number) => index + 1
        },
        {
            title: "Sell ID",
            dataIndex: "sell_id",

        },
        {
            title: "Product name",
            dataIndex: "name",

        },
        {
            title: "Price",
            render: (_: string, record:any, index: number) => {
                return <Typography key={index}>{formatNumber(Number(record.sellPrice || 0))}</Typography>
            }

        },
        {
            title: "qty",
            dataIndex: "qty"
        },
        {
            title: "TotalPrice",
            render: (_: string, record:any, index: number) => {
                return <Typography key={index}>{formatNumber(Number(record.sellPrice || 0) * Number(record?.qty || 0))}</Typography>
            }
        },
        {
            title: "Selled by",
            dataIndex: "username"
        },
        {
            title:"Selled At",
            render: (_: string, record:any, index: number) => {
                return <Typography key={index}>{dayjs(record.selled_at).format('YYYY-MM-DD HH:mm:ss')}</Typography>
            }
        }
    ];


    const getSaleItems = async() => {
        try 
        {
            setLoading(true);

            const result = await dbService(`/get-sell/products?search=${filter}`, 'get' as Method);


            setItems(result?.data?.data || []);
        } 
        catch (error: any) 
        {
            setItems([])
        }
        finally{
            setLoading(false);
        }
    }

    const handleExport = async() => {
        try {
            const rows = items?.map((item: any, index:any) => ({
                no: index + 1,
                sell_id: item?.sell_id,
                name: item?.name,
                sellPrice: item?.sellPrice,
                qty: item?.qty,
                total: formatNumber(Number(item?.sellPrice || 0) * Number(item?.qty || 0)),
                selled_by: item?.username,
                selled_at: dayjs(item?.selled_at).format("YYYY-MM-DD HH:mm")
            }));
  
                const titles = [
                    "ລ/ດ",
                    "ລະຫັດຂາຍ",
                    "ຊື່ສິນຄ້າ",
                    "ລາຄາ",
                    "ຈ/ນ",
                    "ລວມ",
                    "ຜູ້ຂາຍ",
                    "ເວລາຂາຍ"
                ]
                const fileName = `ລາຍການຂາຍ - ${dayjs(new Date()).format('YYYY-MM-HHmmss')}.xlsx`
                await downloadExcel(titles, rows, fileName)
        
        } catch (error) {
          notification.error({
            message: "ລົ້ມແຫຼວ",
            description: "ດາວໂຫລດບໍ່ສຳເລັດ"
          });
        }
      }

    useEffect(()=>{
        getSaleItems();
    },[filter]);

  return (
    <Content>
        <Typography.Title level={3}>Sale Items</Typography.Title>
        <Flex justify='space-between' align='center'>
            <Input.Search 
                size='large' 
                placeholder='Search....' 
                className='!w-full md:!w-1/2 lg:!w-1/3 !my-5' 
                onPressEnter={(e: React.KeyboardEvent<HTMLInputElement>) =>setFilter(e.currentTarget.value.trim())} 
                onSearch={(value: string) => setFilter( value.trim())}
            />

            <Button icon={<PiExportLight/>} type='primary' onClick={handleExport}>Export</Button>
        </Flex>
        <Skeleton loading={loading}>
            <Table
                columns={columns}
                dataSource={items}
                rowKey={"id"}
            />
            <Content className='mt-5 ml-2'>
                <Statistic title="Total:" value={(items ?? []).reduce((sum: number, item: any) => {return sum + (Number(item?.qty || 0) * Number(item?.sellPrice || 0)); }, 0)} />
            </Content>
        </Skeleton>
    </Content>
  )
}

export default SaleList