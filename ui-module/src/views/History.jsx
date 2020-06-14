import React from "react";
import axios from "axios";
import { saveAs } from 'file-saver';

import MIButton from '@material-ui/core/Button';

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
  constructor(props) {
    super(props);

    // this.getProgress = this.getProgress.bind(this);
    // this.getHighlightedText = this.getHighlightedText.bind(this);

    this.state = {
      listItems: []
    };


  }



  componentDidMount() {
    this.timerID = setTimeout(() => this.getHistory(), 1000);
  }

  getHistory() {
    const data = {
      "userId": localStorage.getItem('userId')
    };

    axios({ method: "get", url: "http://localhost:5000/history", data: data })
      .then((res) => {
        console.log(res);
        var resID = 0;
        this.setState({ results: res });

        const listItem = res.data.map((files) => {
          console.log(files);
          resID = resID + 1;
          return (<tr key={resID}>
            <td>{resID}</td>
            <td>{}</td>
            <td><MIButton
              variant="contained"
              color="primary"
              size="large"
              style={{ backgroundColor: '#066294' }}
              onClick={function () {
                var url = "http://localhost:5000/download?filename=" + files.upload;
                axios.get(url, { responseType: 'blob' }).then(
                  (res) => {
                    console.log(res);
                    const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
                    saveAs(pdfBlob, 'newPdf.pdf');
                  }
                )
              }
              }
            >
              Source File
                    </MIButton></td>
            <td><MIButton
              variant="contained"
              color="primary"
              size="large"
              style={{ backgroundColor: '#066294' }}
              onClick={function () {
                var url = "http://localhost:5000/download?filename=" + files.result;
                axios.get(url, { responseType: 'blob' }).then(
                  (res) => {
                    console.log(res);
                    const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
                    saveAs(pdfBlob, 'newPdf.pdf');
                  }
                )
              }
              }
            >
              Result File
                    </MIButton></td>
            <td className="text-right">{files.similarity}</td>
          </tr >)

        });

        this.setState({ listItems: listItem });


        // axios.get("http://localhost:5000/download?filename=test.pdf", {responseType: 'blob'}).then(
        //   (res) => {
        //     console.log(res);
        //     const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
        //     saveAs(pdfBlob, 'newPdf.pdf');
        //   }
        // );

      })
      .catch();
  }


  render() {
    return (
      <>
        <div className="content" style={{ marginTop: '9rem' }}>
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
                    <tbody>{this.state.listItems}</tbody>

                    <MIButton
                      variant="contained"
                      color="primary"
                      size="large"
                      style={{ backgroundColor: '#066294' }}
                      onClick={function () {
                        var p="fbb346b85b0702bc172f74eb787454fe.pdf";
                        var url = "http://localhost:5000/download?filename" + p;
                        axios.get(url, { responseType: 'blob' }).then(
                          (res) => {
                            console.log(res);
                            const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
                            saveAs(pdfBlob, 'newPdf.pdf');
                          }
                        )
                      }
                      }
                    >
                      Source File1
                    </MIButton>


                    <MIButton
                      variant="contained"
                      color="primary"
                      size="large"
                      style={{ backgroundColor: '#066294' }}
                      onClick={function () {
                        var url = "http://localhost:5000/download?filename=fbb346b85b0702bc172f74eb787454fe.pdf";
                        axios.get(url, { responseType: 'blob' }).then(
                          (res) => {
                            console.log(res);
                            const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
                            saveAs(pdfBlob, 'newPdf.pdf');
                          }
                        )
                      }
                      }
                    >
                      Source File2
                    </MIButton>

                    <MIButton
                      variant="contained"
                      color="primary"
                      size="large"
                      style={{ backgroundColor: '#066294' }}
                      onClick={function () {
                        
                        axios.get("http://localhost:5000/download?filename=fbb346b85b0702bc172f74eb787454fe.pdf", { responseType: 'blob' }).then(
                          (res) => {
                            console.log(res);
                            const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
                            saveAs(pdfBlob, 'newPdf.pdf');
                          }
                        )
                      }
                      }
                    >
                      Source File3
                    </MIButton>


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
