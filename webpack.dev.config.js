import cfg from './webpack.base.config'

cfg.target = 'node';
cfg.watch = true
cfg.devtool = 'source-map'

export default cfg
