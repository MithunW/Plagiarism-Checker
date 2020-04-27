import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col
} from "reactstrap";

class History extends React.Component {
  render() {
    return (
      <>
        <div className="content" style={{marginTop:'9rem'}}>
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Plagiarism Check History</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Result ID</th>
                        <th>Date</th>
                        <th>Document(s)</th>
                        <th>Result File</th>
                        <th className="text-right">Similarity Percentage %</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1023</td>
                        <td>3/21/2020</td>
                        <td>doc1.pdf, doc2.pdf</td>
                        <td>result.pdf</td>
                        <td className="text-right">18.00</td>
                      </tr>
                      <tr>
                        <td>1024</td>
                        <td>3/21/2020</td>
                        <td>doc1.pdf, doc2.pdf</td>
                        <td>result.pdf</td>
                        <td className="text-right">10.12</td>
                      </tr>
                      <tr>
                        <td>1025</td>
                        <td>3/21/2020</td>
                        <td>doc1.pdf, doc2.pdf</td>
                        <td>result.pdf</td>
                        <td className="text-right">8.56</td>
                      </tr>
                      <tr>
                        <td>1026</td>
                        <td>3/25/2020</td>
                        <td>doc3.pdf, doc4.pdf</td>
                        <td>result.pdf</td>
                        <td className="text-right">11.36</td>
                      </tr>
                      <tr>
                        <td>1027</td>
                        <td>3/25/2020</td>
                        <td>doc3.pdf, doc4.pdf</td>
                        <td>result.pdf</td>
                        <td className="text-right">7.12</td>
                      </tr>
                      <tr>
                        <td>1028</td>
                        <td>3/28/2020</td>
                        <td>doc1.txt, doc2.txt</td>
                        <td>result.pdf</td>
                        <td className="text-right">46.27</td>
                      </tr>
                      <tr>
                        <td>1029</td>
                        <td>3/28/2020</td>
                        <td>doc1.txt, doc2.txt</td>
                        <td>result.pdf</td>
                        <td className="text-right">25.69</td>
                      </tr>
                      <tr>
                        <td>1030</td>
                        <td>3/28/2020</td>
                        <td>doc1.txt, doc2.txt</td>
                        <td>result.pdf</td>
                        <td className="text-right">14.79</td>
                      </tr>
                      <tr>
                        <td>1031</td>
                        <td>3/21/2020</td>
                        <td>doc1.pdf, doc2.pdf</td>
                        <td>result.pdf</td>
                        <td className="text-right">18</td>
                      </tr>
                      <tr>
                        <td>1032</td>
                        <td>3/21/2020</td>
                        <td>doc1.pdf, doc2.pdf</td>
                        <td>result.pdf</td>
                        <td className="text-right">18</td>
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default History;
