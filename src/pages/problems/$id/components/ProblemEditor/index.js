/**
 * Created by out_xu on 17/8/28.
 */

import React, { Component } from 'react'
import AceEditor from 'components/plugins/AceEditor/async'
import { Button, Checkbox, Divider, Icon, Modal, Select, Tooltip } from 'antd'
import { Link } from 'dva/router'
import copy from 'copy-to-clipboard'
import message from 'utils/message'
import withRouter from 'umi/withRouter'
import { getStatus } from '../../service'
import './index.less'

const { Option } = Select

const languages = ['golang', 'golang', 'java', 'python']

const languageArr = ['C', 'C++', 'Java', 'Python']

@withRouter
class ProblemEditor extends Component {
  state = {
    private: 0,
    source_code: '',
    language: '1'
  }

  componentDidMount () {
    const { solution = '' } = this.props.location.query
    if (solution) {
      getStatus(solution).then(
        res => {
          if (res && res.source) {
            this.setState({ source_code: res.source })
          }
        },
        rej => null
      )
    }
  }

  onRefresh = () => {
    Modal.confirm({
      title: '重置编辑区',
      content: '是否要清空编辑区？',
      onOk: () => {
        this.setState(
          {
            source_code: ''
          },
          () => {
            message.success('重置成功')
          }
        )
      }
    })
  }

  onSubmit = () => {
    Modal.confirm({
      title: '提交确认',
      content: '是否确认提交代码？',
      onOk: () => this.props.handleSubmit(this.state)
    })
  }

  onCopy = () => {
    copy(this.state.source_code)
    message.success('复制成功')
  }

  codeChange = value => {
    this.setState({ source_code: value })
  }

  privateChange = e => {
    this.setState({ private: e.target.checked })
  }

  languageChange = language => {
    this.setState({ language })
  }

  render () {
    const { canSubmit, focusEdit, preLink, afterLink } = this.props
    const { language } = this.state

    const aceEditProps = {
      value: this.state.source_code,
      mode: languages[language],
      theme: 'tomorrow',
      className: 'ace-editor',
      onChange: this.codeChange,
      enableSnippets: true,
      fontSize: 13,
      tabSize: 2,
      width: '100%',
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      onFocus: focusEdit
    }
    return (
      <div className='code-edit'>
        <div className='ace-edit-header flex-lol'>
          <div>编辑代码</div>
          <div className='mr-5'>
            <Link disabled={!preLink} to={'' + preLink}>
              上一题
            </Link>
            <Divider type='vertical' />
            <Link disabled={!afterLink} to={'' + afterLink}>
              下一题
            </Link>
          </div>
        </div>
        <AceEditor {...aceEditProps} />
        <div className='ace-edit-footer flex-lol'>
          <div>
            <Select
              style={{ width: 80 }}
              placeholder='语言'
              optionFilterProp='children'
              onChange={this.languageChange}
              value={language}
            >
              {languageArr.map((item, index) => (
                <Option value={'' + index} key={index}>
                  {item}
                </Option>
              ))}
            </Select>
            <Tooltip title='重置'>
              <Button onClick={this.onRefresh} className='mx-10'>
                <Icon type='sync' />
              </Button>
            </Tooltip>
            <Tooltip title='复制'>
              <Button onClick={this.onCopy}>
                <Icon type='copy' />
              </Button>
            </Tooltip>
          </div>
          <div>
            <Tooltip title='是否公开自己写的代码'>
              <Checkbox onChange={this.privateChange}>私有</Checkbox>
            </Tooltip>

            <Button disabled={!canSubmit} onClick={this.onSubmit} type='primary'>
              <Icon type='rocket' />
              {canSubmit ? '提交' : '请登录'}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default ProblemEditor
