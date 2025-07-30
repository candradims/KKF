import React from 'react';

const Dashboard = () => {
  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#F9FAFB',
      minHeight: '100vh'
    }}>
      {/* Header Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Jumlah Total Pemasangan Card */}
        <div style={{
          backgroundColor: '#00AEEF',
          borderRadius: '12px',
          padding: '1.5rem',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1rem'
          }}>
            <div>
              <h3 style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                margin: '0 0 0.5rem 0',
                opacity: '0.9'
              }}>
                Jumlah Total Pemasangan
              </h3>
              <p style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                520
              </p>
            </div>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '1.5rem' }}>📊</span>
            </div>
          </div>
        </div>

        {/* Jumlah Status Pemasangan Card */}
        <div style={{
          backgroundColor: '#00AEEF',
          borderRadius: '12px',
          padding: '1.5rem',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1rem'
          }}>
            <div>
              <h3 style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                margin: '0 0 0.5rem 0',
                opacity: '0.9'
              }}>
                Jumlah Status Pemasangan
              </h3>
              <p style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                520
              </p>
            </div>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '1.5rem' }}>📋</span>
            </div>
          </div>
        </div>

        {/* Total Profit Card */}
        <div style={{
          backgroundColor: '#00AEEF',
          borderRadius: '12px',
          padding: '1.5rem',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1rem'
          }}>
            <div>
              <h3 style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                margin: '0 0 0.5rem 0',
                opacity: '0.9'
              }}>
                Total Profit
              </h3>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                Rp. 52.000.000,-
              </p>
            </div>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '1.5rem' }}>💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Total Profit Chart */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1F2937',
              margin: 0
            }}>
              Total Profit
            </h3>
            <button style={{
              backgroundColor: 'transparent',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              color: '#6B7280',
              cursor: 'pointer'
            }}>
              Week ▼
            </button>
          </div>
          
          {/* Chart Area */}
          <div style={{
            height: '200px',
            position: 'relative',
            backgroundColor: '#F9FAFB',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{
              textAlign: 'center',
              color: '#6B7280'
            }}>
              <div style={{
                fontSize: '2rem',
                marginBottom: '0.5rem'
              }}>📈</div>
              <p style={{ margin: 0 }}>Chart showing profit trend</p>
              <p style={{ 
                margin: '0.5rem 0 0 0',
                fontSize: '0.875rem',
                color: '#9CA3AF'
              }}>Peak: 25200</p>
            </div>
          </div>
        </div>

        {/* Total Profit Pie Chart */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1F2937',
            margin: '0 0 1.5rem 0'
          }}>
            Total Profit
          </h3>
          
          {/* Pie Chart Area */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'conic-gradient(#00AEEF 0deg 133deg, #60A5FA 133deg 270deg, #93C5FD 270deg 360deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              37%
            </div>
            
            <div style={{
              flex: 1
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#00AEEF'
                    }}></div>
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#6B7280'
                    }}>PLN JAWA-BALI</span>
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#1F2937'
                  }}>37%</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#60A5FA'
                    }}></div>
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#6B7280'
                    }}>PLN LANGKARAN</span>
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#1F2937'
                  }}>24%</span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#93C5FD'
                    }}></div>
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#6B7280'
                    }}>PLN SUMATERA</span>
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#1F2937'
                  }}>28%</span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#DBEAFE'
                    }}></div>
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#6B7280'
                    }}>PLN SULRA</span>
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#1F2937'
                  }}>11%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tren Margin Rate Chart */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1F2937',
              margin: 0
            }}>
              Tren Margin Rate-Rata
            </h3>
            <button style={{
              backgroundColor: 'transparent',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              color: '#6B7280',
              cursor: 'pointer'
            }}>
              Week ▼
            </button>
          </div>
          
          {/* Chart Area */}
          <div style={{
            height: '200px',
            position: 'relative',
            backgroundColor: '#F9FAFB',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{
              textAlign: 'center',
              color: '#6B7280'
            }}>
              <div style={{
                fontSize: '2rem',
                marginBottom: '0.5rem'
              }}>📊</div>
              <p style={{ margin: 0 }}>Margin rate trend chart</p>
              <p style={{ 
                margin: '0.5rem 0 0 0',
                fontSize: '0.875rem',
                color: '#9CA3AF'
              }}>Current: 57%</p>
            </div>
          </div>
        </div>

        {/* Pemasangan Pie Chart */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1F2937',
            margin: '0 0 1.5rem 0'
          }}>
            Pemasangan
          </h3>
          
          {/* Pie Chart Area */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'conic-gradient(#00AEEF 0deg 133deg, #60A5FA 133deg 219deg, #93C5FD 219deg 259deg, #DBEAFE 259deg 360deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              37%
            </div>
            
            <div style={{
              flex: 1
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#00AEEF'
                    }}></div>
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#6B7280'
                    }}>PLN JAWA-BALI</span>
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#1F2937'
                  }}>37%</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#60A5FA'
                    }}></div>
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#6B7280'
                    }}>PLN LANGKARAN</span>
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#1F2937'
                  }}>24%</span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#93C5FD'
                    }}></div>
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#6B7280'
                    }}>PLN SULRA</span>
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#1F2937'
                  }}>11%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
