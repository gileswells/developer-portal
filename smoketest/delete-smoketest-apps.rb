$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), 'vendor', 'bundle', 'ruby', '3.1.0', 'gems'))
p $LOAD_PATH

require_relative './vendor/bundle/ruby/3.1.0/gems/oktakit-0.3.3/lib/oktakit.rb'

id = ARGV[0]

client = Oktakit.new(token: ENV['OKTA_TOKEN'], api_endpoint: ENV['OKTA_BASE_URL'])
response, http_status = client.deactivate_application(id)
p http_status
response, http_status = client.delete_application(id)
p http_status
p response
