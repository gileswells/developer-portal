$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), 'vendor', 'bundle', 'ruby', '3.1.0', 'gems', 'addressable-2.7.0', 'lib'))
$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), 'vendor', 'bundle', 'ruby', '3.1.0', 'gems', 'faraday-1.4.1', 'lib'))
$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), 'vendor', 'bundle', 'ruby', '3.1.0', 'gems', 'faraday-excon-1.1.0', 'lib'))
$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), 'vendor', 'bundle', 'ruby', '3.1.0', 'gems', 'faraday-net_http-1.0.1', 'lib'))
$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), 'vendor', 'bundle', 'ruby', '3.1.0', 'gems', 'faraday-net_http_persistent-1.1.0', 'lib'))
$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), 'vendor', 'bundle', 'ruby', '3.1.0', 'gems', 'multipart-post-2.1.1', 'lib'))
$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), 'vendor', 'bundle', 'ruby', '3.1.0', 'gems', 'oktakit-0.3.3', 'lib'))
$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), 'vendor', 'bundle', 'ruby', '3.1.0', 'gems', 'public_suffix-4.0.6', 'lib'))
$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), 'vendor', 'bundle', 'ruby', '3.1.0', 'gems', 'sawyer-0.8.2', 'lib'))
p $LOAD_PATH

require 'oktakit'

id = ARGV[0]

client = Oktakit.new(token: ENV['OKTA_TOKEN'], api_endpoint: ENV['OKTA_BASE_URL'])
response, http_status = client.deactivate_application(id)
p http_status
response, http_status = client.delete_application(id)
p http_status
p response
