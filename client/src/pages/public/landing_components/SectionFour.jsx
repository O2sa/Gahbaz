import {
  useMantineTheme,
  Container,
  Text,
  Title,
  Grid,
  Card,
  Image,
  Badge,
  Button,
  Group,
  List,
} from '@mantine/core'
import img1 from '../../../assets/images/view1.png'
import img2 from '../../../assets/images/view2.png'
import img3 from '../../../assets/images/view3.png'


const SectionFour = () => {
  const theme = useMantineTheme()

  return (
    <section id="section-four">
      <Container>
        <Text color="black" align="center">
          <Title order={1} mb="30px">
            اختر اشتراك
          </Title>
        </Text>

        <Grid>
          <Grid.Col xs={12} sm={4} md={4} lg={4}>
            <Card shadow="sm" p="lg" style={{ height: '100%' }}>
              <Card.Section>
                <Image src={img1} alt={'sample1'} />
              </Card.Section>

              <Group position="apart" style={{ marginBottom: 20, marginTop: theme.spacing.sm }}>
                <Text weight={500}>المستوى الأول</Text>
                <Badge variant="filled">$100</Badge>
              </Group>

              <List>
                <List.Item>2000TB تخزين.</List.Item>
                <List.Item>20 كلية كأقصى حد.</List.Item>
                <List.Item>تحديثات دورية وميزات جديدة</List.Item>
              </List>

              <Button variant="light" fullWidth mt="14px">
                اشتراك
              </Button>
            </Card>
          </Grid.Col>

          <Grid.Col xs={12} sm={4} md={4} lg={4}>
            <Card shadow="sm" p="lg" style={{ height: '100%' }}>
              <Card.Section>
                <Image src={img2} alt={'sample1'} />
              </Card.Section>

              <Group position="apart" style={{ marginBottom: 20, marginTop: theme.spacing.sm }}>
              <Text weight={500}>المستوى الثاني</Text>
                <Badge variant="filled">$250</Badge>
              </Group>

              <List>
                <List.Item>4000TB تخزين.</List.Item>
                <List.Item>عدد لا محدود من الكليات</List.Item>
                <List.Item>تحديثات دورية وميزات جديدة + اقتراح ميزات جديدة</List.Item>
              </List>

              <Button variant="light" fullWidth mt="14px">
                اشتراك
              </Button>
            </Card>
          </Grid.Col>

          <Grid.Col xs={12} sm={4} md={4} lg={4}>
            <Card shadow="sm" p="lg" style={{ height: '100%' }}>
              <Card.Section>
                <Image src={img3} alt={'sample1'} />
              </Card.Section>

              <Group position="apart" style={{ marginBottom: 20, marginTop: theme.spacing.sm }}>
              <Text weight={500}>المستوى الثالث</Text>
                <Badge variant="filled">$1000</Badge>
              </Group>

              <List>
                <List.Item>ميزات الاشتراك الثاني+</List.Item>
                <List.Item> الدخول الضمن الرعاة الرسميين لتطوير النظام</List.Item>
              </List>
              <Button variant="light" fullWidth mt="14px">
                اشتراك
              </Button>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </section>
  )
}

export default SectionFour
