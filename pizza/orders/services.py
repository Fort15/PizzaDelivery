from confluent_kafka import Producer

def send_order_event(order_id):
    producer = Producer({'bootstrap.servers': 'localhost:9092'})
    producer.produce('orders', f'OrderCreated:{order_id}')
    producer.flush()